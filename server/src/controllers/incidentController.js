const Incident = require('../models/Incident');
const Postmortem = require('../models/Postmortem');
const { generateIncidentSummary, suggestRootCause, generatePostmortem } = require('../services/aiService');
const { getIO } = require('../sockets/server.socket');

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res) => {
  try {
    const { status, severity, service, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (service) query.service = service;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const incidents = await Incident.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new incident
// @route   POST /api/incidents
// @access  Private (Admin, Responder)
const createIncident = async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      createdBy: req.user._id,
      responders: [{ user: req.user._id }]
    });

    getIO().emit('incident:new', incident);


    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('createdBy responders.user updates.createdBy', 'name email avatar');

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update incident (add updates/messages)
// @route   POST /api/incidents/:id/updates
// @access  Private (Admin, Responder)
const addIncidentUpdate = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    const update = {
      message: req.body.message,
      status: req.body.status,
      createdBy: req.user._id
    };

    incident.updates.push(update);

    if (req.body.status) incident.status = req.body.status;

    await incident.save();

    const io = getIO();

    io.to(`incident:${incident._id}`).emit('incident:update', {
      incidentId: incident._id,
      update
    });

    if (req.body.status) {
      io.to(`incident:${incident._id}`).emit('incident:statusChange', {
        incidentId: incident._id,
        status: req.body.status
      });
      // Also broadcast to everyone for the dashboard and status page
      io.emit('incident:listUpdate', { incidentId: incident._id, status: req.body.status });
    }

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Resolve incident
// @route   POST /api/incidents/:id/resolve
// @access  Private (Admin, Responder)
const resolveIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    incident.status = 'resolved';
    incident.resolvedAt = new Date();

    incident.updates.push({
      message: 'Incident resolved.',
      status: 'resolved',
      createdBy: req.user._id
    });

    await incident.save();

    getIO().to(`incident:${incident._id}`).emit('incident:resolve', {
      incidentId: incident._id
    }); 
    getIO().emit('incident:listUpdate', { incidentId: incident._id, status: 'resolved' });

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate AI summary for incident
// @route   POST /api/incidents/:id/summary
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    const summary = await generateIncidentSummary(incident, incident.updates);

    incident.aiSummary = summary;
    await incident.save();

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI postmortem
// @route   POST /api/incidents/:id/postmortem
// @access  Private
const generatePM = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    let pm = await Postmortem.findOne({ incident: incident._id });

    if (pm) return res.json(pm);

    const content = await generatePostmortem(incident, incident.updates);

    pm = await Postmortem.create({
      incident: incident._id,
      content,
      editedContent: content,
      generatedBy: req.user._id
    });

    res.status(201).json(pm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get postmortem by incident ID
// @route   GET /api/incidents/:id/postmortem
// @access  Private
const getPostmortem = async (req, res) => {
  try {
    const pm = await Postmortem.findOne({ incident: req.params.id });

    if (!pm) return res.status(404).json({ message: 'Postmortem not found' });

    res.json(pm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suggest root cause using AI
// @route   POST /api/incidents/:id/rootcause
// @access  Private
const getRootCauseSuggestions = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    const suggestions = await suggestRootCause(incident, incident.updates);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update incident details
// @route   PUT /api/incidents/:id
// @access  Private (Admin, Responder)
const updateIncident = async (req, res) => {
  try {
    const { title, description, service } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { title, description, service },
      { new: true, runValidators: true }
    );

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add responder to incident
// @route   POST /api/incidents/:id/responders
// @access  Private (Admin)
const addResponder = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    const { userId } = req.body;

    if (incident.responders.some(r => r.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a responder' });
    }

    incident.responders.push({ user: userId });
    await incident.save();

    getIO().to(`user:${userId}`).emit('responder:added', {
      incidentId: incident._id,
      title: incident.title
    }); 

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update postmortem content
// @route   PUT /api/incidents/:id/postmortem
// @access  Private (Admin, Responder)
const updatePostmortem = async (req, res) => {
  try {
    const { editedContent } = req.body;

    const pm = await Postmortem.findOneAndUpdate(
      { incident: req.params.id },
      { editedContent },
      { new: true }
    );

    if (!pm) return res.status(404).json({ message: 'Postmortem not found' });

    res.json(pm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin)
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    await incident.deleteOne();
    await Postmortem.deleteOne({ incident: req.params.id });

    res.json({ message: 'Incident and associated postmortem deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIncidents,
  createIncident,
  getIncidentById,
  addIncidentUpdate,
  resolveIncident,
  generateSummary,
  generatePM,
  getPostmortem,
  getRootCauseSuggestions,
  updateIncident,
  addResponder,
  updatePostmortem,
  deleteIncident
};
