const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

const normalize = (row) => row ? { ...row, _id: row.id } : null;
const normalizeAll = (rows) => (rows || []).map(normalize);

// GET /api/timeline - list all timeline events sorted by date
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(normalizeAll(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/timeline - add new timeline event
router.post('/', async (req, res) => {
  try {
    const { title, date, notes, tag } = req.body;
    const { data, error } = await supabase
      .from('timeline_events')
      .insert({ title, date, notes: notes || '', tag: tag || 'General' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalize(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/timeline/:id - edit event
router.put('/:id', async (req, res) => {
  try {
    const { title, date, notes, tag } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (date !== undefined) updates.date = date;
    if (notes !== undefined) updates.notes = notes;
    if (tag !== undefined) updates.tag = tag;

    const { data, error } = await supabase
      .from('timeline_events')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });
    res.json(normalize(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/timeline/:id - delete event
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
