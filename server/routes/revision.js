const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

const normalize = (row) => row ? { ...row, _id: row.id } : null;
const normalizeAll = (rows) => (rows || []).map(normalize);

// GET /api/revision-tasks
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('revision_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(normalizeAll(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/revision-tasks
router.post('/', async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const { data, error } = await supabase
      .from('revision_tasks')
      .insert({ title, category: category || 'General' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalize(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/revision-tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, category, completed, weekKey } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (completed !== undefined) updates.completed = completed;
    if (weekKey !== undefined) updates.week_key = weekKey;

    const { data, error } = await supabase
      .from('revision_tasks')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Task not found' });
    res.json(normalize(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/revision-tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('revision_tasks')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
