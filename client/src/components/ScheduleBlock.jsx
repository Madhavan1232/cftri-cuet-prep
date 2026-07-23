import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Edit2, X, Check, RotateCcw, Plus, Trash2 } from 'lucide-react';

const DEFAULT_SLOTS = [
  { id: '1', start: '15:00', end: '16:00', type: 'study', title: 'Focus Session 1' },
  { id: '2', start: '16:00', end: '17:00', type: 'study', title: 'Focus Session 2' },
  { id: '3', start: '17:00', end: '17:30', type: 'break', title: 'Study Break & Tea' },
  { id: '4', start: '17:30', end: '18:30', type: 'study', title: 'Practice & Problem Solving' },
  { id: '5', start: '18:30', end: '19:30', type: 'study', title: 'Concept Revision' },
  { id: '6', start: '19:30', end: '20:00', type: 'study', title: 'Daily Recap & Review' },
];

export default function ScheduleBlock({ breakStart = '17:00', breakEnd = '17:30' }) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [isWithinStudyBlock, setIsWithinStudyBlock] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load custom slots from localStorage, or use defaults
  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem('study_block_slots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_SLOTS;
  });

  // Temporary draft state for editing in modal
  const [draftSlots, setDraftSlots] = useState(slots);

  // Sync break slot times when props change if using defaults
  useEffect(() => {
    if (breakStart && breakEnd) {
      setSlots(prev => prev.map(s => {
        if (s.type === 'break') {
          return { ...s, start: breakStart, end: breakEnd };
        }
        return s;
      }));
    }
  }, [breakStart, breakEnd]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(mins);

      if (slots.length > 0) {
        const minStart = Math.min(...slots.map(s => parseTimeToMins(s.start)));
        const maxEnd = Math.max(...slots.map(s => parseTimeToMins(s.end)));
        setIsWithinStudyBlock(mins >= minStart && mins <= maxEnd);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [slots]);

  const parseTimeToMins = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  };

  const checkIsActive = (startStr, endStr) => {
    const s = parseTimeToMins(startStr);
    const e = parseTimeToMins(endStr);
    return currentMinutes >= s && currentMinutes < e;
  };

  // Find break slot for badge display
  const breakSlot = slots.find(s => s.type === 'break') || { start: breakStart, end: breakEnd };
  const formattedBreakStart = format12Hour(breakSlot.start);
  const formattedBreakEnd = format12Hour(breakSlot.end);

  // Overall block time bounds
  const firstStart = slots.length > 0 ? format12Hour(slots[0].start) : '3:00 PM';
  const lastEnd = slots.length > 0 ? format12Hour(slots[slots.length - 1].end) : '8:00 PM';

  const handleOpenEditModal = () => {
    setDraftSlots(JSON.parse(JSON.stringify(slots)));
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    setSlots(draftSlots);
    localStorage.setItem('study_block_slots', JSON.stringify(draftSlots));
    setIsEditModalOpen(false);
  };

  const handleResetDefaults = () => {
    setDraftSlots(DEFAULT_SLOTS);
  };

  const handleDraftChange = (index, field, value) => {
    setDraftSlots(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddSlot = () => {
    const newId = String(Date.now());
    const lastSlot = draftSlots[draftSlots.length - 1];
    const newStart = lastSlot ? lastSlot.end : '20:00';
    const [h, m] = newStart.split(':').map(Number);
    const newEnd = `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    setDraftSlots(prev => [
      ...prev,
      { id: newId, start: newStart, end: newEnd, type: 'study', title: 'New Focus Session' }
    ]);
  };

  const handleDeleteSlot = (index) => {
    if (draftSlots.length <= 1) return;
    setDraftSlots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard-card space-y-4 relative">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
              Daily Study Block ({firstStart} – {lastEnd})
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

        {/* Top Right Controls: Break Badge + Single Edit Button */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded text-[11px] font-medium text-[#787774] dark:text-[#9B9B9B] bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] shrink-0 whitespace-nowrap">
            <Coffee className="w-3.5 h-3.5 shrink-0" />
            <span>Break: {formattedBreakStart} – {formattedBreakEnd}</span>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors shrink-0"
            title="Edit Study Block Schedule & Sessions"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {slots.map((slot, i) => {
          const isActive = checkIsActive(slot.start, slot.end);
          const isBreak = slot.type === 'break';
          const label = `${format12Hour(slot.start)} - ${format12Hour(slot.end)}`;

          return (
            <div
              key={slot.id || i}
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
                  {label}
                </span>
                <div className="flex items-center gap-0.5">
                  {isBreak ? (
                    <Coffee className="w-3.5 h-3.5 text-[#787774]" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-[#787774]" />
                  )}
                </div>
              </div>

              <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0] truncate">
                {slot.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Edit Schedule Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E9E9E7] dark:border-[#2E2E2E] shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#787774]" />
                <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
                  Edit Daily Study Schedule & Sessions
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: List of sessions to edit */}
            <form onSubmit={handleSaveModal} className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              <div className="space-y-2.5">
                {draftSlots.map((slot, idx) => (
                  <div
                    key={slot.id || idx}
                    className="p-3 rounded-lg border border-[#E9E9E7] dark:border-[#2E2E2E] bg-[#F7F7F5] dark:bg-[#252525] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
                        Session #{idx + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        <select
                          value={slot.type}
                          onChange={(e) => handleDraftChange(idx, 'type', e.target.value)}
                          className="notion-input text-xs h-7 py-0 px-2"
                        >
                          <option value="study">Study Focus</option>
                          <option value="break">Relaxation Break</option>
                        </select>

                        {draftSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(idx)}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#787774] hover:text-red-500 hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
                            title="Remove session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-[#787774] dark:text-[#9B9B9B] mb-1">Session Title</label>
                        <input
                          type="text"
                          required
                          value={slot.title}
                          onChange={(e) => handleDraftChange(idx, 'title', e.target.value)}
                          placeholder="Session Name"
                          className="notion-input w-full text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#787774] dark:text-[#9B9B9B] mb-1">Start Time</label>
                        <input
                          type="time"
                          required
                          value={slot.start}
                          onChange={(e) => handleDraftChange(idx, 'start', e.target.value)}
                          className="notion-input w-full text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#787774] dark:text-[#9B9B9B] mb-1">End Time</label>
                        <input
                          type="time"
                          required
                          value={slot.end}
                          onChange={(e) => handleDraftChange(idx, 'end', e.target.value)}
                          className="notion-input w-full text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Session & Reset buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="notion-btn text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Session Slot</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="notion-btn text-xs text-[#787774] hover:text-[#37352F] gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="notion-btn text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="notion-btn text-xs bg-[#37352F] text-white dark:bg-[#E3E3E0] dark:text-[#191919] hover:bg-[#2A2A28] gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
