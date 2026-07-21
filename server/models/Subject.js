const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['CFTRI', 'CUET', 'General'], default: 'CFTRI' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  color: { type: String, default: '#3b82f6' },
  targetHours: { type: Number, default: 40 }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
