const mongoose = require('mongoose');

const ingestLogSchema = new mongoose.Schema({
  service: { type: String, required: true },
  apiKey: { type: String },
  payload: { type: Object, required: true },
  aiDecision: {
    is_incident: Boolean,
    title: String,
    severity: String,
    probable_cause: String
  },
  incidentCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }
}, { timestamps: true });

module.exports = mongoose.model('IngestLog', ingestLogSchema);
