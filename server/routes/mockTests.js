const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

const normalize = (row) => row ? { ...row, _id: row.id } : null;
const normalizeAll = (rows) => (rows || []).map(normalize);

// GET /api/mock-tests - get tests for a given month prefix or all
router.get('/', async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    let query = supabase.from('mock_tests').select('*').order('date', { ascending: true });

    if (month) {
      // Filter dates starting with the given month prefix (YYYY-MM)
      query = query.like('date', `${month}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(normalizeAll(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mock-tests - toggle/set mock test for a date
router.post('/', async (req, res) => {
  try {
    const { date, completed, score, notes } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });

    // Check if record exists for this date
    const { data: existing, error: fetchErr } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('date', date)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr;

    if (existing) {
      const updates = { updated_at: new Date().toISOString() };
      if (completed !== undefined) updates.completed = completed;
      if (score !== undefined) updates.score = score;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabase
        .from('mock_tests')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(normalize(data));
    } else {
      const { data, error } = await supabase
        .from('mock_tests')
        .insert({
          date,
          completed: completed !== undefined ? completed : true,
          score: score || 0,
          notes: notes || ''
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(normalize(data));
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
