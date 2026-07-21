import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Plus, Clock, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function WeeklyStudyChart({ studyLogs = [], subjects = [], onLogHours }) {
  const { theme } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [hours, setHours] = useState('2');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState(false);

  // Calculate current week days (Monday to Sunday)
  const getCurrentWeekDays = () => {
    const curr = new Date();
    const first = curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr);
      d.setDate(first + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      week.push({ dateStr, dayName, display: `${dayName} (${d.getDate()}/${d.getMonth()+1})` });
    }
    return week;
  };

  const weekDays = getCurrentWeekDays();

  // Format data for Recharts stacked bar chart
  const chartData = weekDays.map((day) => {
    const entry = { name: day.dayName, date: day.dateStr, total: 0 };
    subjects.forEach((subj) => {
      entry[subj.name] = 0;
    });

    const logsForDay = studyLogs.filter(l => l.date === day.dateStr);
    logsForDay.forEach(l => {
      if (entry[l.subjectName] !== undefined) {
        entry[l.subjectName] += l.hours;
      } else {
        entry[l.subjectName] = l.hours;
      }
      entry.total += l.hours;
    });

    return entry;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjName = selectedSubject || (subjects[0]?.name || 'General Study');
    if (!subjName || !hours) return;
    onLogHours({ date, subjectName: subjName, hours: Number(hours) });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="dashboard-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Weekly Study Hours Graph
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hours logged per subject across the current week
          </p>
        </div>

        {/* Quick Log Inline Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap sm:flex-nowrap bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono"
          />

          <select
            value={selectedSubject || (subjects[0]?.name || '')}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-medium max-w-[130px] truncate"
          >
            {subjects.map(s => (
              <option key={s._id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono"
            />
            <span className="text-xs text-slate-400 font-medium">hrs</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </form>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
          <Check className="w-4 h-4" />
          <span>Study hours logged successfully! Streak updated.</span>
        </div>
      )}

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
            <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} unit="h" />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#cbd5e1',
                borderRadius: '8px',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {subjects.map((subj) => (
              <Bar
                key={subj._id || subj.name}
                dataKey={subj.name}
                stackId="a"
                fill={subj.color || '#3b82f6'}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
