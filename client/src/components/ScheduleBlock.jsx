import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Sparkles, Heart, Edit2, Check, X } from 'lucide-react';

export default function ScheduleBlock({ breakStart = '17:00', breakEnd = '17:30' }) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [isWithinStudyBlock, setIsWithinStudyBlock] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState('');

  // Persist custom slot titles in localStorage
  const [slotTitles, setSlotTitles] = useState(() => {
    const saved = localStorage.getItem('study_block_slot_titles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(mins);

      // Study block: 3:00 PM (15:00 = 900 mins) to 8:00 PM (20:00 = 1200 mins)
      setIsWithinStudyBlock(mins >= 900 && mins <= 1200);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const parseTimeToMins = (timeStr) => {
    if (!timeStr) return 1020;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper to format "17:00" to 12-hour string "5:00 PM"
  const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  };

  const formattedBreakStart = format12Hour(breakStart) || '5:00 PM';
  const formattedBreakEnd = format12Hour(breakEnd) || '5:30 PM';

  const defaultSlots = [
    { id: 0, start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM', type: 'study', defaultTitle: 'Focus Flow 🌸' },
    { id: 1, start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM', type: 'study', defaultTitle: 'Deep Prep Session 💖' },
    { id: 2, start: breakStart, end: breakEnd, label: `${formattedBreakStart} - ${formattedBreakEnd}`, type: 'break', defaultTitle: 'Cozy Break & Tea 🍵' },
    { id: 3, start: '17:30', end: '18:30', label: '5:30 PM - 6:30 PM', type: 'study', defaultTitle: 'MCQ Practice Power ✨' },
    { id: 4, start: '18:30', end: '19:30', label: '6:30 PM - 7:30 PM', type: 'study', defaultTitle: 'Concept Revision 📚' },
    { id: 5, start: '19:30', end: '20:00', label: '7:30 PM - 8:00 PM', type: 'study', defaultTitle: 'Daily Recap & Notes 🌟' },
  ];

  const handleStartEdit = (idx, currentTitle) => {
    setEditingIndex(idx);
    setTempTitle(currentTitle);
  };

  const handleSaveEdit = (idx) => {
    const updated = { ...slotTitles, [idx]: tempTitle.trim() || defaultSlots[idx].defaultTitle };
    setSlotTitles(updated);
    localStorage.setItem('study_block_slot_titles', JSON.stringify(updated));
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const checkIsActive = (startStr, endStr) => {
    const s = parseTimeToMins(startStr);
    const e = parseTimeToMins(endStr);
    return currentMinutes >= s && currentMinutes < e;
  };

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit">
              Daily Study Block (3:00 PM – 8:00 PM)
            </h3>
            {isWithinStudyBlock && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 animate-pulse">
                <Sparkles className="w-3 h-3 text-rose-500" /> Active Focus Now
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Your dedicated study routine block with customizable slot titles
          </p>
        </div>

        <div className="text-xs font-medium text-pink-700 dark:text-pink-300 flex items-center gap-1.5 bg-pink-50 dark:bg-plum-900 px-3 py-1.5 rounded-xl border border-pink-200/50 dark:border-pink-900/50">
          <Coffee className="w-3.5 h-3.5 text-pink-500" />
          <span>Tea Break: {formattedBreakStart} – {formattedBreakEnd}</span>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {defaultSlots.map((slot, i) => {
          const isActive = checkIsActive(slot.start, slot.end);
          const isBreak = slot.type === 'break';
          const displayTitle = slotTitles[i] || slot.defaultTitle;
          const isEditingThis = editingIndex === i;

          return (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/15 to-purple-500/15 border-pink-500 text-pink-950 dark:text-pink-50 ring-2 ring-pink-500/30'
                  : isBreak
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                  : 'bg-slate-50/70 dark:bg-plum-900/40 border-slate-200/80 dark:border-pink-950/60 text-slate-800 dark:text-pink-200/90'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-2 h-full bg-pink-500 animate-pulse" />
              )}

              {/* Time Label & Edit Trigger */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold tracking-wider font-mono opacity-80">
                  {slot.label}
                </span>

                <div className="flex items-center gap-1">
                  {!isEditingThis && (
                    <button
                      onClick={() => handleStartEdit(i, displayTitle)}
                      className="p-1 rounded-lg text-slate-400 hover:text-pink-500 dark:hover:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
                      title="Edit slot title"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isBreak ? (
                    <Coffee className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-pink-500 animate-spin' : 'text-slate-400'}`} />
                  )}
                </div>
              </div>

              {/* Title display or inline editing input */}
              {isEditingThis ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    autoFocus
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(i);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="w-full px-2 py-1 rounded-lg border border-pink-300 dark:border-pink-700 bg-white dark:bg-plum-900 text-xs font-bold text-slate-900 dark:text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={() => handleSaveEdit(i)}
                    className="p-1 rounded-lg bg-pink-500 text-white hover:bg-pink-600 shrink-0"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 rounded-lg bg-slate-200 dark:bg-plum-800 text-slate-600 dark:text-pink-300 hover:bg-slate-300 shrink-0"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <h4 className="text-xs font-bold truncate pr-4">{displayTitle}</h4>
              )}

              {isActive && !isEditingThis && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300 mt-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> In Progress
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
