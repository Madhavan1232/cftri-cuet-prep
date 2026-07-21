const mongoose = require('mongoose');

const StudyLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format YYYY-MM-DD
  subjectName: { type: String, required: true },
  hours: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StudyLog', StudyLogSchema);
