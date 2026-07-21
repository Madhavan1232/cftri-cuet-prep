const mongoose = require('mongoose');

const ExamSettingsSchema = new mongoose.Schema({
  cftriDate: { type: Date, default: new Date('2026-08-20T09:00:00') },
  cuetDate: { type: Date, default: new Date('2026-09-05T09:00:00') },
  breakStart: { type: String, default: '17:00' },
  breakEnd: { type: String, default: '17:30' },
  pomodoroWork: { type: Number, default: 25 },
  pomodoroShortBreak: { type: Number, default: 5 },
  pomodoroLongBreak: { type: Number, default: 15 }
}, { timestamps: true });

module.exports = mongoose.model('ExamSettings', ExamSettingsSchema);
