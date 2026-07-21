const mongoose = require('mongoose');

const MockTestSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  completed: { type: Boolean, default: true },
  score: { type: Number },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MockTest', MockTestSchema);
