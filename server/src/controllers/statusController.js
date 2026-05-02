const Incident = require('../models/Incident');

/**
 * 
 * @desc    Get public status page data
 * @route   GET /api/status/public
 * @access  Public
 */
const getPublicStatus = async (req, res) => {
  try {
    const active = await Incident.find({ status: { $ne: 'resolved' } }).sort({ createdAt: -1 });
    const history = await Incident.find({ status: 'resolved', resolvedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }).sort({ resolvedAt: -1 });
    let overallStatus = 'operational';
    if (active.some(i => i.severity === 'critical')) overallStatus = 'major-outage';
    else if (active.length > 0) overallStatus = 'degraded';
    res.json({ overallStatus, activeIncidents: active, resolvedHistory: history });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

/**  @desc    Subscribe to status updates
* @route   POST /api/status/subscribe
* @access  Public
 */
const subscribeToStatus = async (req, res) => {
  res.status(201).json({ message: 'Subscribed successfully' });
};

module.exports = {
  getPublicStatus,
  subscribeToStatus
};
