const express = require('express');
const router = express.Router();
const ExamSettings = require('../models/ExamSettings');

// GET /api/exams - get settings or create default
router.get('/', async (req, res) => {
  try {
    let settings = await ExamSettings.findOne();
    if (!settings) {
      settings = await ExamSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/exams - update settings
router.put('/', async (req, res) => {
  try {
    let settings = await ExamSettings.findOne();
    if (!settings) {
      settings = new ExamSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
