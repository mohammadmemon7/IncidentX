const cron = require('node-cron');
const Monitor = require('../models/Monitor');
const Check = require('../models/Check');
const Incident = require('../models/Incident');
const { performCheck } = require('../services/monitorService');
const { getIO } = require('../sockets/server.socket');

const handleMonitorResult = async (monitor, result) => {
  const previousStatus = monitor.status;
  monitor.status = result.success ? 'up' : 'down';
  monitor.lastCheckedAt = new Date();
  await monitor.save();

  console.log(`[Monitor] ${monitor.name} (${monitor.url}) - Status: ${monitor.status} (Previous: ${previousStatus})`);

  // Emit real-time status update
  try {
    getIO().to('admin').emit('monitor:status', monitor);
  } catch (err) {
    // Socket might not be initialized yet
  }

  // Logic for auto-incident creation
  if (!result.success && previousStatus !== 'down') {
    console.log(`[Monitor] Site ${monitor.name} detected as DOWN. Creating incident...`);
    const existingIncident = await Incident.findOne({
      service: monitor.name,
      status: { $ne: 'resolved' }
    });

    if (!existingIncident) {
      try {
        const incident = await Incident.create({
          title: `Auto-detected: ${monitor.name} is down`,
          description: `Monitor detected failure at ${monitor.url}. Error: ${result.error}`,
          severity: 'critical',
          service: monitor.name,
          isAutoDetected: true,
          ingestPayload: result,
          updates: [{
            message: `Monitor detected failure: ${result.error || 'Timeout/HTTP Error'}`,
            status: 'investigating',
            isAI: true
          }]
        });
        console.log(`[Monitor] Auto-incident created: ${incident._id}`);
        
        try {
          getIO().to('admin').emit('incident:new', incident);
          getIO().emit('incident:listUpdate');
        } catch (socketErr) {}
      } catch (createErr) {
        console.error('[Monitor] Failed to create incident:', createErr.message);
      }
    } else {
      console.log(`[Monitor] Incident already exists for ${monitor.name}, skipping creation.`);
    }
  }

  // Logic for auto-resolution
  if (result.success && previousStatus === 'down') {
    console.log(`[Monitor] Site ${monitor.name} is back UP. Auto-resolving incident...`);
    const openIncident = await Incident.findOne({
      service: monitor.name,
      status: { $ne: 'resolved' }
    });

    if (openIncident) {
      openIncident.status = 'resolved';
      openIncident.resolvedAt = new Date();
      openIncident.updates.push({
        message: 'Monitor reports site is back up. Auto-resolving incident.',
        status: 'resolved',
        isAI: true
      });
      await openIncident.save();

      try {
        getIO().to(`incident:${openIncident._id}`).emit('incident:resolve', { incidentId: openIncident._id });
        getIO().emit('incident:listUpdate');
      } catch (err) {}
    }
  }
};

const startMonitorCron = () => {
  console.log('Monitor cron job started (every 60s)');
  cron.schedule('* * * * *', async () => {
    console.log('Running Monitor Health Checks...');
    try {
      const monitors = await Monitor.find();
      
      for (const monitor of monitors) {
        const result = await performCheck(monitor.url);
        
        await Check.create({
          monitorId: monitor._id,
          ...result
        });

        await handleMonitorResult(monitor, result);
      }
    } catch (error) {
      console.error('Error in Monitor Cron:', error);
    }
  });
};

module.exports = { startMonitorCron, handleMonitorResult };
