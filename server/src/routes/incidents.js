const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/incidentController');

router.get('/', protect, getIncidents);
router.post('/', protect, authorize('admin', 'responder'), createIncident);
router.get('/:id', protect, getIncidentById);
router.post('/:id/updates', protect, authorize('admin', 'responder'), addIncidentUpdate);
router.post('/:id/resolve', protect, authorize('admin', 'responder'), resolveIncident);
router.post('/:id/summary', protect, generateSummary);
router.post('/:id/postmortem', protect, generatePM);
router.get('/:id/postmortem', protect, getPostmortem);
router.post('/:id/rootcause', protect, getRootCauseSuggestions);
router.put('/:id', protect, authorize('admin', 'responder'), updateIncident);
router.post('/:id/responders', protect, authorize('admin'), addResponder);
router.put('/:id/postmortem', protect, authorize('admin', 'responder'), updatePostmortem);
router.delete('/:id', protect, authorize('admin'), deleteIncident);

module.exports = router;