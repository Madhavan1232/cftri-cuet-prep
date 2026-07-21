const express = require('express');
const router = express.Router();
const MockTest = require('../models/MockTest');

// GET /api/mock-tests - get tests for a given month prefix or all
router.get('/', async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    let query = {};
    if (month) {
      query.date = { $regex: `^${month}` };
    }
    const mockTests = await MockTest.find(query).sort({ date: 1 });
    res.json(mockTests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mock-tests - toggle/set mock test for a date
router.post('/', async (req, res) => {
  try {
    const { date, completed, score, notes } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });

    let existing = await MockTest.findOne({ date });
    if (existing) {
      if (completed !== undefined) existing.completed = completed;
      if (score !== undefined) existing.score = score;
      if (notes !== undefined) existing.notes = notes;
      await existing.save();
      return res.json(existing);
    } else {
      const created = await MockTest.create({
        date,
        completed: completed !== undefined ? completed : true,
        score: score || 0,
        notes: notes || ''
      });
      return res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
