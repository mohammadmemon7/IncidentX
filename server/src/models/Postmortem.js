const mongoose = require('mongoose');

const postmortemSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, unique: true },
  content: { type: String, required: true },
  editedContent: { type: String },
  rootCause: { type: String },
  actionItems: [{ type: String }],
  similarIncidents: [{
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    title: String,
    resolvedIn: String,
    fix: String
  }],
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Postmortem', postmortemSchema);
