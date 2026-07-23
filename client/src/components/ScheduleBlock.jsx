import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Edit2, Check, X } from 'lucide-react';

export default function ScheduleBlock({ breakStart = '17:00', breakEnd = '17:30' }) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [isWithinStudyBlock, setIsWithinStudyBlock] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState('');

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
    { id: 0, start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM', type: 'study', defaultTitle: 'Focus Session 1' },
    { id: 1, start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM', type: 'study', defaultTitle: 'Focus Session 2' },
    { id: 2, start: breakStart, end: breakEnd, label: `${formattedBreakStart} - ${formattedBreakEnd}`, type: 'break', defaultTitle: 'Study Break & Tea' },
    { id: 3, start: '17:30', end: '18:30', label: '5:30 PM - 6:30 PM', type: 'study', defaultTitle: 'Practice & Problem Solving' },
    { id: 4, start: '18:30', end: '19:30', label: '6:30 PM - 7:30 PM', type: 'study', defaultTitle: 'Concept Revision' },
    { id: 5, start: '19:30', end: '20:00', label: '7:30 PM - 8:00 PM', type: 'study', defaultTitle: 'Daily Recap & Review' },
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
              Daily Study Block (3:00 PM – 8:00 PM)
            </h3>
            {isWithinStudyBlock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#37352F] dark:text-[#E3E3E0] border border-[#E9E9E7] dark:border-[#2E2E2E] whitespace-nowrap">
                • Active Now
              </span>
            )}
          </div>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mt-0.5">
            Fixed preparation routine block with scheduled relaxation break
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded text-[11px] font-medium text-[#787774] dark:text-[#9B9B9B] bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] shrink-0 whitespace-nowrap">
          <Coffee className="w-3.5 h-3.5 shrink-0" />
          <span>Break: {formattedBreakStart} – {formattedBreakEnd}</span>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {defaultSlots.map((slot, i) => {
          const isActive = checkIsActive(slot.start, slot.end);
          const isBreak = slot.type === 'break';
          const displayTitle = slotTitles[i] || slot.defaultTitle;
          const isEditingThis = editingIndex === i;

          return (
            <div
              key={i}
              className={`p-3 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-[#F7F7F5] dark:bg-[#2A2A2A] border-[#37352F] dark:border-[#666666]'
                  : isBreak
                  ? 'bg-[#F9F9F8] dark:bg-[#222222] border-[#E9E9E7] dark:border-[#2E2E2E]'
                  : 'bg-white dark:bg-[#252525] border-[#E9E9E7] dark:border-[#2E2E2E]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium font-mono text-[#787774] dark:text-[#9B9B9B]">
                  {slot.label}
                </span>
                <div className="flex items-center gap-0.5">
                  {!isEditingThis && (
                    <button
                      onClick={() => handleStartEdit(i, displayTitle)}
                      className="w-6 h-6 flex items-center justify-center rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
                      title="Edit slot title"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  {isBreak
                    ? <Coffee className="w-3.5 h-3.5 text-[#787774]" />
                    : <Clock  className="w-3.5 h-3.5 text-[#787774]" />
                  }
                </div>
              </div>

              {isEditingThis ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    autoFocus
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(i);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="notion-input flex-1 text-xs"
                  />
                  <button
                    onClick={() => handleSaveEdit(i)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-[#37352F] dark:bg-[#E3E3E0] text-white dark:text-[#191919] shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="w-8 h-8 flex items-center justify-center rounded bg-[#EFEFED] dark:bg-[#333333] text-[#787774] shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0] truncate">{displayTitle}</h4>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
