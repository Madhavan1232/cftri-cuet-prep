import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Plus, Check, Settings, Trash2, X, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function WeeklyStudyChart({ studyLogs = [], subjects = [], onLogHours, onAddSubject, onDeleteSubject }) {
  const { theme } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [hours, setHours] = useState('2');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState(false);

  // Manage Subjects Modal / Expand state
  const [showManageModal, setShowManageModal] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCategory, setNewSubjCategory] = useState('CFTRI');
  const [newSubjColor, setNewSubjColor] = useState('#ec4899');

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

  const handleSubmitLog = (e) => {
    e.preventDefault();
    const subjName = selectedSubject || (subjects[0]?.name || 'General Study');
    if (!subjName || !hours) return;
    onLogHours({ date, subjectName: subjName, hours: Number(hours) });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;
    if (onAddSubject) {
      onAddSubject({
        name: newSubjName.trim(),
        category: newSubjCategory,
        color: newSubjColor,
        progress: 0
      });
    }
    setNewSubjName('');
  };

  const isDark = theme === 'dark';

  return (
    <div className="dashboard-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-500" />
              Weekly Study Hours Graph
            </h3>

            {/* Manage Subjects Trigger Button */}
            <button
              onClick={() => setShowManageModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-pink-50 dark:bg-plum-900 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 border border-pink-200/60 dark:border-pink-900/50 transition-colors"
              title="Add or Remove Subjects"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Subjects</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Hours logged per subject across the current week
          </p>
        </div>

        {/* Quick Log Inline Form */}
        <form onSubmit={handleSubmitLog} className="flex items-center gap-2 flex-wrap sm:flex-nowrap bg-pink-50/50 dark:bg-plum-900/60 p-2 rounded-2xl border border-pink-100 dark:border-pink-950/60">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-plum-800 border border-pink-200 dark:border-pink-900/60 text-xs font-mono text-slate-800 dark:text-pink-100"
          />

          <select
            value={selectedSubject || (subjects[0]?.name || '')}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-plum-800 border border-pink-200 dark:border-pink-900/60 text-xs font-medium max-w-[140px] truncate text-slate-800 dark:text-pink-100"
          >
            {subjects.map(s => (
              <option key={s._id || s.name} value={s.name}>{s.name}</option>
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
              className="w-14 px-2 py-1 rounded-xl bg-white dark:bg-plum-800 border border-pink-200 dark:border-pink-900/60 text-xs font-mono text-slate-800 dark:text-pink-100"
            />
            <span className="text-xs text-pink-400 font-medium">hrs</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </form>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20">
          <Check className="w-4 h-4" />
          <span>Study hours logged successfully! Streak updated. ✨</span>
        </div>
      )}

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2e142f' : '#fbcfe8'} />
            <XAxis dataKey="name" stroke={isDark ? '#f472b6' : '#db2777'} fontSize={12} />
            <YAxis stroke={isDark ? '#f472b6' : '#db2777'} fontSize={12} unit="h" />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#180a19' : '#ffffff',
                borderColor: isDark ? '#381a3b' : '#fbcfe8',
                borderRadius: '12px',
                color: isDark ? '#fdf2f8' : '#180a19',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {subjects.map((subj) => (
              <Bar
                key={subj._id || subj.name}
                dataKey={subj.name}
                stackId="a"
                fill={subj.color || '#ec4899'}
                radius={[3, 3, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manage Subjects Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-plum-900 border border-pink-200 dark:border-pink-900/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/80 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
                <Tag className="w-4 h-4 text-pink-500" />
                Manage Graph Subjects
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-pink-200 hover:bg-pink-50 dark:hover:bg-plum-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Subject Form */}
            <form onSubmit={handleAddSubjectSubmit} className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-plum-950/60 border border-pink-200 dark:border-pink-900/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Add New Subject
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    required
                    value={newSubjName}
                    onChange={(e) => setNewSubjName(e.target.value)}
                    placeholder="Subject Name"
                    className="w-full px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-xs font-medium focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <select
                    value={newSubjCategory}
                    onChange={(e) => setNewSubjCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-xs font-medium"
                  >
                    <option value="CFTRI">CFTRI</option>
                    <option value="CUET">CUET</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newSubjColor}
                    onChange={(e) => setNewSubjColor(e.target.value)}
                    className="w-8 h-8 p-0.5 rounded-lg border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 cursor-pointer shrink-0"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 transition-colors shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </form>

            {/* List of Existing Subjects with Delete buttons */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-pink-300/70">
                Active Subjects ({subjects.length})
              </h4>
              {subjects.map((subj) => (
                <div
                  key={subj._id || subj.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-plum-950/40 border border-pink-100 dark:border-pink-950/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: subj.color || '#ec4899' }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-pink-100">
                      {subj.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300">
                      {subj.category}
                    </span>
                  </div>

                  {onDeleteSubject && (
                    <button
                      onClick={() => onDeleteSubject(subj._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-pink-100 dark:border-pink-950/80">
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-pink-500 text-white hover:bg-pink-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
