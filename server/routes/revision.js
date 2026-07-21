const express = require('express');
const router = express.Router();
const RevisionTask = require('../models/RevisionTask');

// GET /api/revision-tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await RevisionTask.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/revision-tasks
router.post('/', async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await RevisionTask.create({ title, category: category || 'General' });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/revision-tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await RevisionTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/revision-tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await RevisionTask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
