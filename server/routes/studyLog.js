const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Map snake_case → camelCase + _id alias for frontend compatibility
const normalizeLog = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    subjectName: row.subject_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};
const normalizeAll = (rows) => (rows || []).map(normalizeLog);

// GET /api/study-log - get logs optionally filtered by date range
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = supabase.from('study_logs').select('*').order('date', { ascending: true });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;
    if (error) throw error;
    res.json(normalizeAll(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/study-log - log hours for subject and date (upsert)
router.post('/', async (req, res) => {
  try {
    const { date, subjectName, hours } = req.body;
    if (!date || !subjectName || hours === undefined) {
      return res.status(400).json({ error: 'Missing required fields: date, subjectName, hours' });
    }

    // Check for existing log for same date + subject
    const { data: existing, error: fetchErr } = await supabase
      .from('study_logs')
      .select('*')
      .eq('date', date)
      .eq('subject_name', subjectName)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr;

    if (existing) {
      const { data, error } = await supabase
        .from('study_logs')
        .update({
          hours: existing.hours + Number(hours),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(normalizeLog(data));
    } else {
      const { data, error } = await supabase
        .from('study_logs')
        .insert({ date, subject_name: subjectName, hours: Number(hours) })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(normalizeLog(data));
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/study-log/:id
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('study_logs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
