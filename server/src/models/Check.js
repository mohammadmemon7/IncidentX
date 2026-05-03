const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  monitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monitor', required: true },
  statusCode: { type: Number },
  responseTime: { type: Number },
  success: { type: Boolean, required: true },
  error: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Check', checkSchema);
