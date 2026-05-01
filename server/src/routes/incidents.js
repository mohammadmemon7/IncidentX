const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Postmortem = require('../models/Postmortem');
const { protect, authorize } = require('../middleware/auth');
const { generateIncidentSummary, suggestRootCause, generatePostmortem } = require('../services/aiService');

router.get('/', protect, async (req, res) => {
  try {
    const { status, severity, service, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (service) query.service = service;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    const incidents = await Incident.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const incident = await Incident.create({ ...req.body, createdBy: req.user._id, responders: [{ user: req.user._id }] });
    req.app.get('io').to('admin').emit('incident:new', incident);
    res.status(201).json(incident);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('createdBy responders.user updates.createdBy', 'name email avatar');
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/:id/updates', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    const update = { message: req.body.message, status: req.body.status, createdBy: req.user._id };
    incident.updates.push(update);
    if (req.body.status) incident.status = req.body.status;
    await incident.save();
    const io = req.app.get('io');
    io.to(`incident:${incident._id}`).emit('incident:update', { incidentId: incident._id, update });
    if (req.body.status) io.to(`incident:${incident._id}`).emit('incident:statusChange', { incidentId: incident._id, status: req.body.status });
    res.status(201).json(incident);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/:id/resolve', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    incident.status = 'resolved';
    incident.resolvedAt = new Date();
    incident.updates.push({ message: 'Incident resolved.', status: 'resolved', createdBy: req.user._id });
    await incident.save();
    req.app.get('io').to(`incident:${incident._id}`).emit('incident:resolve', { incidentId: incident._id });
    res.json(incident);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/:id/summary', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    const summary = await generateIncidentSummary(incident, incident.updates);
    incident.aiSummary = summary;
    await incident.save();
    res.json({ summary });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/:id/postmortem', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    let pm = await Postmortem.findOne({ incident: incident._id });
    if (pm) return res.json(pm);
    const content = await generatePostmortem(incident, incident.updates);
    pm = await Postmortem.create({ incident: incident._id, content, editedContent: content, generatedBy: req.user._id });
    res.status(201).json(pm);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/:id/rootcause', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    const suggestions = await suggestRootCause(incident, incident.updates);
    res.json(suggestions);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
