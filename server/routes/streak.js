const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET /api/streak
router.get('/', async (req, res) => {
  try {
    // Fetch all active study log dates (hours > 0)
    const { data: logs, error: logsErr } = await supabase
      .from('study_logs')
      .select('date')
      .gt('hours', 0);

    if (logsErr) throw logsErr;

    // Fetch all completed mock test dates
    const { data: mockTests, error: mockErr } = await supabase
      .from('mock_tests')
      .select('date')
      .eq('completed', true);

    if (mockErr) throw mockErr;

    const activeDates = new Set();
    (logs || []).forEach(l => activeDates.add(l.date));
    (mockTests || []).forEach(m => activeDates.add(m.date));

    // Convert active dates to sorted array
    const sortedDates = Array.from(activeDates).sort();

    if (sortedDates.length === 0) {
      return res.json({ currentStreak: 0, longestStreak: 0, activeDates: [] });
    }

    // Helper to format date to YYYY-MM-DD
    const formatDate = (d) => d.toISOString().split('T')[0];

    // Helper to subtract days
    const subtractDays = (dateStr, days) => {
      const d = new Date(dateStr + 'T00:00:00');
      d.setDate(d.getDate() - days);
      return formatDate(d);
    };

    const todayStr = formatDate(new Date());
    const yesterdayStr = subtractDays(todayStr, 1);

    let currentStreak = 0;
    let checkDate = activeDates.has(todayStr)
      ? todayStr
      : activeDates.has(yesterdayStr)
        ? yesterdayStr
        : null;

    if (checkDate) {
      while (activeDates.has(checkDate)) {
        currentStreak++;
        checkDate = subtractDays(checkDate, 1);
      }
    }

    // Longest streak calculation
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDateObj = null;

    for (const dStr of sortedDates) {
      const currDateObj = new Date(dStr + 'T00:00:00');
      if (!prevDateObj) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currDateObj - prevDateObj) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDateObj = currDateObj;
    }

    res.json({
      currentStreak,
      longestStreak: Math.max(currentStreak, longestStreak),
      activeDates: Array.from(activeDates)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
