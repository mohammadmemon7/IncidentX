const Monitor = require('../models/Monitor');
const Check = require('../models/Check');
const { performCheck } = require('../services/monitorService');
const { handleMonitorResult } = require('../cron/monitorCron');

// @desc    Get all monitors
// @route   GET /api/monitors
// @access  Private (Admin, Responder)
const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find().sort({ createdAt: -1 });
    res.json(monitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a monitor
// @route   POST /api/monitors
// @access  Private (Admin)
const createMonitor = async (req, res) => {
  try {
    const { name, url, interval } = req.body;
    const monitor = await Monitor.create({
      name,
      url,
      interval,
      createdBy: req.user._id
    });
    res.status(201).json(monitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single monitor with last 10 checks
// @route   GET /api/monitors/:id
// @access  Private (Admin, Responder)
const getMonitorById = async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor) return res.status(404).json({ message: 'Monitor not found' });

    const checks = await Check.find({ monitorId: monitor._id })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({ monitor, checks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update monitor
// @route   PUT /api/monitors/:id
// @access  Private (Admin)
const updateMonitor = async (req, res) => {
  try {
    const { name, url, interval } = req.body;
    const monitor = await Monitor.findByIdAndUpdate(
      req.params.id,
      { name, url, interval },
      { new: true, runValidators: true }
    );
    if (!monitor) return res.status(404).json({ message: 'Monitor not found' });
    res.json(monitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete monitor
// @route   DELETE /api/monitors/:id
// @access  Private (Admin)
const deleteMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor) return res.status(404).json({ message: 'Monitor not found' });

    await monitor.deleteOne();
    await Check.deleteMany({ monitorId: req.params.id });

    res.json({ message: 'Monitor and checks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually trigger a check
// @route   POST /api/monitors/:id/check
// @access  Private (Admin)
const triggerCheck = async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor) return res.status(404).json({ message: 'Monitor not found' });

    const result = await performCheck(monitor.url);
    
    await Check.create({
      monitorId: monitor._id,
      ...result
    });

    await handleMonitorResult(monitor, result);

    res.json({ message: 'Check performed', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMonitors,
  createMonitor,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  triggerCheck
};
