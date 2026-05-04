const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMonitors,
  createMonitor,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  triggerCheck
} = require('../controllers/monitorController');

router.get('/', protect, getMonitors);
router.post('/', protect, authorize('admin'), createMonitor);
router.get('/:id', protect, getMonitorById);
router.put('/:id', protect, authorize('admin'), updateMonitor);
router.delete('/:id', protect, authorize('admin'), deleteMonitor);
router.post('/:id/check', protect, authorize('admin'), triggerCheck);

module.exports = router;
