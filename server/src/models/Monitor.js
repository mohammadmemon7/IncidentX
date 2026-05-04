const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  interval: { type: Number, default: 60 },
  status: { type: String, enum: ['up', 'down', 'pending'], default: 'pending' },
  lastCheckedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Monitor', monitorSchema);
