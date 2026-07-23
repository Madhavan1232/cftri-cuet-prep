const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET /api/exams - get settings or create default
router.get('/', async (req, res) => {
  try {
    let { data, error } = await supabase.from('exam_settings').select('*').limit(1).single();

    if (error && error.code === 'PGRST116') {
      // No row found — insert default values
      const insert = await supabase
        .from('exam_settings')
        .insert({
          cftri_date: '2026-08-20T09:00:00Z',
          cuet_date: '2026-09-05T09:00:00Z',
          break_start: '17:00',
          break_end: '17:30',
          pomodoro_work: 25,
          pomodoro_short_break: 5,
          pomodoro_long_break: 15
        })
        .select()
        .single();
      if (insert.error) throw insert.error;
      return res.json(normalizeExamSettings(insert.data));
    }
    if (error) throw error;

    res.json(normalizeExamSettings(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/exams - update settings
router.put('/', async (req, res) => {
  try {
    // Get existing or create
    let { data: existing, error: fetchErr } = await supabase
      .from('exam_settings')
      .select('id')
      .limit(1)
      .single();

    // Map camelCase frontend keys → snake_case DB columns
    const {
      cftriDate, cuetDate, breakStart, breakEnd,
      pomodoroWork, pomodoroShortBreak, pomodoroLongBreak
    } = req.body;

    const updates = {};
    if (cftriDate !== undefined) updates.cftri_date = cftriDate;
    if (cuetDate !== undefined) updates.cuet_date = cuetDate;
    if (breakStart !== undefined) updates.break_start = breakStart;
    if (breakEnd !== undefined) updates.break_end = breakEnd;
    if (pomodoroWork !== undefined) updates.pomodoro_work = pomodoroWork;
    if (pomodoroShortBreak !== undefined) updates.pomodoro_short_break = pomodoroShortBreak;
    if (pomodoroLongBreak !== undefined) updates.pomodoro_long_break = pomodoroLongBreak;
    updates.updated_at = new Date().toISOString();

    let result;
    if (fetchErr || !existing) {
      // Insert new
      result = await supabase.from('exam_settings').insert(updates).select().single();
    } else {
      // Update existing
      result = await supabase
        .from('exam_settings')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Return camelCase-friendly object
    res.json(normalizeExamSettings(result.data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Map DB snake_case → camelCase for exam settings
function normalizeExamSettings(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    cftriDate: row.cftri_date,
    cuetDate: row.cuet_date,
    breakStart: row.break_start,
    breakEnd: row.break_end,
    pomodoroWork: row.pomodoro_work,
    pomodoroShortBreak: row.pomodoro_short_break,
    pomodoroLongBreak: row.pomodoro_long_break,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = router;
