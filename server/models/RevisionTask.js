const mongoose = require('mongoose');

const RevisionTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  completed: { type: Boolean, default: false },
  weekKey: { type: String, default: '' } // Optional week tag if tracking by week
}, { timestamps: true });

module.exports = mongoose.model('RevisionTask', RevisionTaskSchema);
