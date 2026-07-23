const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Add _id alias + map snake_case → camelCase for frontend
const normalizeSubject = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    targetHours: row.target_hours,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};
const normalizeAll = (rows) => (rows || []).map(normalizeSubject);

// GET /api/subjects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(normalizeAll(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/subjects
router.post('/', async (req, res) => {
  try {
    const { name, category, progress, color, targetHours } = req.body;
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        name,
        category: category || 'CFTRI',
        progress: progress || 0,
        color: color || '#3b82f6',
        target_hours: targetHours || 40
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeSubject(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/subjects/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, category, progress, color, targetHours } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (progress !== undefined) updates.progress = progress;
    if (color !== undefined) updates.color = color;
    if (targetHours !== undefined) updates.target_hours = targetHours;

    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Subject not found' });
    res.json(normalizeSubject(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/subjects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
