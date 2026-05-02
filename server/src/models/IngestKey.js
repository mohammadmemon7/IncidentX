const mongoose = require('mongoose');

const ingestKeySchema = new mongoose.Schema({
  service: { type: String, required: true, unique: true },
  key: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('IngestKey', ingestKeySchema);
