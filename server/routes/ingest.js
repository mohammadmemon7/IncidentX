const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const IngestLog = require('../models/IngestLog');
const { analyzeLog } = require('../services/aiService');
const { protect, authorize } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { service, log_level, message } = req.body;
  try {
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
      req.app.get('io').to('admin').emit('incident:new', incident);
    }
    const log = await IngestLog.create({ service, payload: req.body, aiDecision, incidentCreated: incidentId });
    res.status(201).json({ success: true, incidentCreated: !!incidentId, logId: log._id });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/logs', protect, authorize('admin'), async (req, res) => {
  try { res.json(await IngestLog.find().sort({ createdAt: -1 }).limit(50)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
