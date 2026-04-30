const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  message: { type: String, required: true },
  status: { type: String, enum: ['investigating', 'identified', 'monitoring', 'resolved'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAI: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ['critical', 'major', 'minor'], required: true },
  status: { type: String, enum: ['investigating', 'identified', 'monitoring', 'resolved'], default: 'investigating' },
  service: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  responders: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now }
  }],
  updates: [updateSchema],
  isAutoDetected: { type: Boolean, default: false },
  ingestPayload: { type: Object },
  aiSummary: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
