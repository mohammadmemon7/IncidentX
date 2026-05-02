const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Incident = require('../models/Incident');
const IngestLog = require('../models/IngestLog');
const IngestKey = require('../models/IngestKey');
const User = require('../models/User');
const { analyzeLog } = require('../services/aiService');
const { getIO } = require('../sockets/server.socket');

// @desc    Ingest logs and auto-detect incidents
// @route   POST /api/ingest
// @access  Public (with API key)

const ingestLog = async (req, res) => {
  let isAdminSimulation = false;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.role === 'admin') isAdminSimulation = true;
    } catch (err) { /* ignore */ }
  }

  const apiKey = req.headers['x-ingest-key'];
  if (!apiKey && !isAdminSimulation) return res.status(401).json({ message: "Missing x-ingest-key header" });
  
  const { service, log_level, message } = req.body;
  if (!service) return res.status(400).json({ message: "Service is required" });
  
  try {
    if (!isAdminSimulation) {
      const validKey = await IngestKey.findOne({ service, key: apiKey });
      if (!validKey) return res.status(403).json({ message: "Invalid API key for this service" });
    }

    const aiDecision = await analyzeLog(req.body);
    let incidentId = null;
    if (aiDecision && aiDecision.is_incident) {
      const incident = await Incident.create({
        title: aiDecision.title,
        description: `Auto-detected: ${message}`,
        severity: aiDecision.severity,
        service,
        isAutoDetected: true,
        updates: [{ message: `AI Detected: ${aiDecision.probable_cause}`, isAI: true }]
      });
      incidentId = incident._id;
      getIO().to('admin').emit('incident:new', incident);
    }
    const log = await IngestLog.create({ service, apiKey, payload: req.body, aiDecision, incidentCreated: incidentId });
    res.status(201).json({ success: true, incidentCreated: !!incidentId, logId: log._id });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get ingest logs
// @route   GET /api/ingest/logs
// @access  Private (Admin)
const getLogs = async (req, res) => {
  try { res.json(await IngestLog.find().sort({ createdAt: -1 }).limit(50)); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Generate/Rotate API key for a service
// @route   POST /api/ingest/keys
// @access  Private (Admin)
const generateKey = async (req, res) => {
  const { service } = req.body;
  if (!service) return res.status(400).json({ message: "Service name required" });
  
  try {
    const key = crypto.randomBytes(16).toString('hex');
    const ingestKey = await IngestKey.findOneAndUpdate(
      { service },
      { key },
      { upsert: true, new: true }
    );
    res.status(201).json({ service, key });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ingestLog,
  getLogs,
  generateKey
};
