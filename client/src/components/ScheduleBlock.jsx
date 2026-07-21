import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Sparkles, Heart } from 'lucide-react';

export default function ScheduleBlock({ breakStart = '17:00', breakEnd = '17:30' }) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [isWithinStudyBlock, setIsWithinStudyBlock] = useState(false);

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

  const slots = [
    { start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM', type: 'study', title: 'Focus Flow 🌸' },
    { start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM', type: 'study', title: 'Deep Prep Session 💖' },
    { start: breakStart, end: breakEnd, label: `${breakStart} - ${breakEnd}`, type: 'break', title: 'Cozy Break & Tea 🍵' },
    { start: '17:30', end: '18:30', label: '5:30 PM - 6:30 PM', type: 'study', title: 'MCQ Practice Power ✨' },
    { start: '18:30', end: '19:30', label: '6:30 PM - 7:30 PM', type: 'study', title: 'Concept Revision 📚' },
    { start: '19:30', end: '20:00', label: '7:30 PM - 8:00 PM', type: 'study', title: 'Daily Recap & Notes 🌟' },
  ];

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
            Your dedicated study routine block with a relaxing tea break
          </p>
        </div>

        <div className="text-xs font-medium text-pink-700 dark:text-pink-300 flex items-center gap-1.5 bg-pink-50 dark:bg-plum-900 px-3 py-1.5 rounded-xl border border-pink-200/50 dark:border-pink-900/50">
          <Coffee className="w-3.5 h-3.5 text-pink-500" />
          <span>Tea Break: {breakStart} – {breakEnd}</span>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slots.map((slot, i) => {
          const isActive = checkIsActive(slot.start, slot.end);
          const isBreak = slot.type === 'break';

          return (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
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

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold tracking-wider font-mono opacity-80">
                  {slot.label}
                </span>
                {isBreak ? (
                  <Coffee className="w-4 h-4 text-rose-500" />
                ) : (
                  <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-pink-500 animate-spin' : 'text-slate-400'}`} />
                )}
              </div>

              <h4 className="text-xs font-bold truncate">{slot.title}</h4>

              {isActive && (
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
