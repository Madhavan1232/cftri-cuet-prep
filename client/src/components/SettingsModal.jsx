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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Dashboard & Exam Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Exam Target Dates */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> Target Exam Dates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">CFTRI Exam Date</label>
                <input
                  type="datetime-local"
                  required
                  value={cftriDate}
                  onChange={(e) => setCftriDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">CUET Exam Date</label>
                <input
                  type="datetime-local"
                  required
                  value={cuetDate}
                  onChange={(e) => setCuetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Study Schedule Break Slot */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Study Block Break Slot (3-8 PM)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Break Start Time</label>
                <input
                  type="time"
                  required
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Break End Time</label>
                <input
                  type="time"
                  required
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pomodoro Durations */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-purple-500" /> Pomodoro Timer Durations (Mins)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Focus Session</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroWork}
                  onChange={(e) => setPomodoroWork(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={pomodoroShortBreak}
                  onChange={(e) => setPomodoroShortBreak(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroLongBreak}
                  onChange={(e) => setPomodoroLongBreak(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
