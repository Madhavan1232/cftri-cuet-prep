const express = require('express');
const router = express.Router();
const StudyLog = require('../models/StudyLog');

// GET /api/study-log - get logs optionally filtered by date range
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    const logs = await StudyLog.find(query).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/study-log - log hours for subject and date
router.post('/', async (req, res) => {
  try {
    const { date, subjectName, hours } = req.body;
    if (!date || !subjectName || hours === undefined) {
      return res.status(400).json({ error: 'Missing required fields: date, subjectName, hours' });
    }

    // Upsert or append log
    const existing = await StudyLog.findOne({ date, subjectName });
    if (existing) {
      existing.hours += Number(hours);
      await existing.save();
      return res.json(existing);
    } else {
      const newLog = await StudyLog.create({ date, subjectName, hours: Number(hours) });
      return res.status(201).json(newLog);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/study-log/:id
router.delete('/:id', async (req, res) => {
  try {
    await StudyLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
