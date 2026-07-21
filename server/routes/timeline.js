const express = require('express');
const router = express.Router();
const TimelineEvent = require('../models/TimelineEvent');

// GET /api/timeline - list all timeline events sorted by date
router.get('/', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/timeline - add new timeline event
router.post('/', async (req, res) => {
  try {
    const { title, date, notes, tag } = req.body;
    const event = await TimelineEvent.create({ title, date, notes, tag });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/timeline/:id - edit event
router.put('/:id', async (req, res) => {
  try {
    const event = await TimelineEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/timeline/:id - delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await TimelineEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
