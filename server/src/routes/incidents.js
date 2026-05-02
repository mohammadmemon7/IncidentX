const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Postmortem = require('../models/Postmortem');
const { protect, authorize } = require('../middleware/auth');
const { generateIncidentSummary, suggestRootCause, generatePostmortem } = require('../services/aiService');
const { getIO } = require('../sockets/server.socket');

router.get('/', protect, async (req, res) => {
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
});

router.post('/', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      createdBy: req.user._id,
      responders: [{ user: req.user._id }]
    });

    getIO().to('admin').emit('incident:new', incident);

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('createdBy responders.user updates.createdBy', 'name email avatar');

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/updates', protect, authorize('admin', 'responder'), async (req, res) => {
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
    }

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/resolve', protect, authorize('admin', 'responder'), async (req, res) => {
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

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/summary', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    const summary = await generateIncidentSummary(incident, incident.updates);

    incident.aiSummary = summary;
    await incident.save();

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/postmortem', protect, async (req, res) => {
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
});

router.get('/:id/postmortem', protect, async (req, res) => {
  try {
    const pm = await Postmortem.findOne({ incident: req.params.id });

    if (!pm) return res.status(404).json({ message: 'Postmortem not found' });

    res.json(pm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/rootcause', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    const suggestions = await suggestRootCause(incident, incident.updates);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'responder'), async (req, res) => {
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
});

router.post('/:id/responders', protect, authorize('admin'), async (req, res) => {
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
});

router.put('/:id/postmortem', protect, authorize('admin', 'responder'), async (req, res) => {
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
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    await incident.deleteOne();
    await Postmortem.deleteOne({ incident: req.params.id });

    res.json({ message: 'Incident and associated postmortem deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;