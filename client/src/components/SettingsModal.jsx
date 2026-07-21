import React, { useState } from 'react';
import { X, Save, Calendar, Clock, Timer } from 'lucide-react';

export default function SettingsModal({ settings, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const formatDateForInput = (d) => {
    if (!d) return '';
    const dateObj = new Date(d);
    return dateObj.toISOString().slice(0, 16);
  };

  const [cftriDate, setCftriDate] = useState(formatDateForInput(settings?.cftriDate));
  const [cuetDate, setCuetDate] = useState(formatDateForInput(settings?.cuetDate));
  const [breakStart, setBreakStart] = useState(settings?.breakStart || '17:00');
  const [breakEnd, setBreakEnd] = useState(settings?.breakEnd || '17:30');
  const [pomodoroWork, setPomodoroWork] = useState(settings?.pomodoroWork || 25);
  const [pomodoroShortBreak, setPomodoroShortBreak] = useState(settings?.pomodoroShortBreak || 5);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(settings?.pomodoroLongBreak || 15);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      cftriDate: new Date(cftriDate),
      cuetDate: new Date(cuetDate),
      breakStart,
      breakEnd,
      pomodoroWork: Number(pomodoroWork),
      pomodoroShortBreak: Number(pomodoroShortBreak),
      pomodoroLongBreak: Number(pomodoroLongBreak)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-lg p-5 max-w-lg w-full shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E9E7] dark:border-[#2E2E2E] pb-2.5">
          <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
            Dashboard Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Exam Dates */}
          <div className="space-y-2">
            <h4 className="font-medium text-[#787774] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#787774]" /> Target Exam Dates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">CFTRI Exam Date</label>
                <input
                  type="datetime-local"
                  required
                  value={cftriDate}
                  onChange={(e) => setCftriDate(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">CUET Exam Date</label>
                <input
                  type="datetime-local"
                  required
                  value={cuetDate}
                  onChange={(e) => setCuetDate(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Study Schedule Break Slot */}
          <div className="space-y-2 pt-2 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
            <h4 className="font-medium text-[#787774] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#787774]" /> Study Block Break Slot (3-8 PM)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">Break Start Time</label>
                <input
                  type="time"
                  required
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">Break End Time</label>
                <input
                  type="time"
                  required
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pomodoro Durations */}
          <div className="space-y-2 pt-2 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
            <h4 className="font-medium text-[#787774] uppercase tracking-wider flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#787774]" /> Pomodoro Durations (Minutes)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroWork}
                  onChange={(e) => setPomodoroWork(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={pomodoroShortBreak}
                  onChange={(e) => setPomodoroShortBreak(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#37352F] dark:text-[#E3E3E0] font-medium mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroLongBreak}
                  onChange={(e) => setPomodoroLongBreak(e.target.value)}
                  className="notion-input w-full text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
            <button
              type="button"
              onClick={onClose}
              className="notion-btn text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="notion-btn text-xs bg-[#37352F] text-white dark:bg-[#E3E3E0] dark:text-[#191919] flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
