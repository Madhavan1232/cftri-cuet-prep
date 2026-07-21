const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '' },
  tag: { type: String, enum: ['CFTRI', 'CUET', 'General'], default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('TimelineEvent', TimelineEventSchema);
