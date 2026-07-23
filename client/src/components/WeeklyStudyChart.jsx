import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Plus, Check, Settings, Trash2, X, Tag, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function WeeklyStudyChart({ studyLogs = [], subjects = [], onLogHours, onAddSubject, onDeleteSubject }) {
  const { theme } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [hours, setHours] = useState('2');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState(false);

  const [showManageModal, setShowManageModal] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCategory, setNewSubjCategory] = useState('CFTRI');
  const [newSubjColor, setNewSubjColor] = useState('#787774');

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

  // Notion palette for chart bars
  const notionBarColors = [
    '#787774', '#9B9B9B', '#454545', '#B4B4B4', '#606060', '#838383', '#505050'
  ];

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
    if (selectedSubject === '__manage__') {
      setShowManageModal(true);
      return;
    }
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
    <div className="dashboard-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
              Weekly Study Hours Graph
            </h3>
            <button
              onClick={() => setShowManageModal(true)}
              className="inline-flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors whitespace-nowrap"
              title="Add or Remove Subjects"
            >
              <Settings className="w-3 h-3" />
              <span>Edit Subjects</span>
            </button>
          </div>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mt-0.5">
            Hours logged per subject across the current week
          </p>
        </div>

        {/* Quick Log Inline Form */}
        <form onSubmit={handleSubmitLog} className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap bg-[#F7F7F5] dark:bg-[#202020] p-1.5 rounded border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="notion-input text-xs font-mono w-36"
          />
          <select
            value={selectedSubject || (subjects[0]?.name || '')}
            onChange={(e) => {
              if (e.target.value === '__manage__') setShowManageModal(true);
              else setSelectedSubject(e.target.value);
            }}
            className="notion-input text-xs flex-1 min-w-[100px]"
          >
            {subjects.map(s => (
              <option key={s._id || s.name} value={s.name}>{s.name}</option>
            ))}
            <option value="__manage__">+ Manage Subjects...</option>
          </select>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="notion-input w-14 text-xs font-mono text-center"
            />
            <span className="text-xs text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">hrs</span>
          </div>

          <button
            type="submit"
            className="notion-btn text-xs py-1 px-2.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 inline mr-0.5" />
            <span>Log</span>
          </button>
        </form>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-2 rounded bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#37352F] dark:text-[#E3E3E0] text-xs border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <Check className="w-3.5 h-3.5 text-[#787774]" />
          <span>Study hours logged successfully.</span>
        </div>
      )}

      {/* Recharts Bar Chart */}
      <div className="h-60 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#888888' : '#787774'} strokeWidth={1.5} strokeOpacity={0.8} />
            <XAxis dataKey="name" stroke={isDark ? '#9B9B9B' : '#787774'} fontSize={12} />
            <YAxis stroke={isDark ? '#9B9B9B' : '#787774'} fontSize={12} unit="h" />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#202020' : '#ffffff',
                borderColor: isDark ? '#2E2E2E' : '#E9E9E7',
                borderRadius: '6px',
                color: isDark ? '#E3E3E0' : '#37352F',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {subjects.map((subj, idx) => (
              <Bar
                key={subj._id || subj.name}
                dataKey={subj.name}
                stackId="a"
                fill={subj.color && subj.color !== '#ec4899' ? subj.color : notionBarColors[idx % notionBarColors.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manage Subjects Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-lg p-5 max-w-lg w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E9E7] dark:border-[#2E2E2E] pb-2.5">
              <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#787774]" />
                Manage Subject Options
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-1 rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add New Subject Form */}
            <form onSubmit={handleAddSubjectSubmit} className="p-3 rounded bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] space-y-2.5">
              <h4 className="text-xs font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">
                Add New Subject
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    required
                    value={newSubjName}
                    onChange={(e) => setNewSubjName(e.target.value)}
                    placeholder="Subject Name"
                    className="notion-input w-full text-xs"
                  />
                </div>
                <div>
                  <select
                    value={newSubjCategory}
                    onChange={(e) => setNewSubjCategory(e.target.value)}
                    className="notion-input w-full text-xs"
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
                    className="w-7 h-7 p-0 rounded border border-[#E9E9E7] bg-white cursor-pointer shrink-0"
                  />
                  <button
                    type="submit"
                    className="notion-btn w-full text-xs py-1"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </form>

            {/* List of Existing Subjects */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <h4 className="text-xs font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">
                Active Subjects ({subjects.length})
              </h4>
              {subjects.map((subj, idx) => (
                <div
                  key={subj._id || subj.name}
                  className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#252525] border border-[#E9E9E7] dark:border-[#2E2E2E]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: subj.color || notionBarColors[idx % notionBarColors.length] }}
                    />
                    <span className="text-xs font-medium text-[#37352F] dark:text-[#E3E3E0]">
                      {subj.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B]">
                      {subj.category}
                    </span>
                  </div>

                  {onDeleteSubject && (
                    <button
                      onClick={() => onDeleteSubject(subj._id)}
                      className="p-1 text-[#787774] hover:text-red-500 rounded transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="notion-btn text-xs"
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
