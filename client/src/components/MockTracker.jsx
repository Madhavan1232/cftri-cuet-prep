import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, Circle, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function MockTracker({ mockTests = [], onToggleMockTest }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const completedDatesSet = new Set(
    mockTests.filter(m => m.completed).map(m => m.date)
  );

  const daysArray = [];
  for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${monthStr}-${String(d).padStart(2, '0')}`;
    daysArray.push({
      dayNum: d,
      dateStr: dStr,
      isCompleted: completedDatesSet.has(dStr),
      isToday: dStr === new Date().toISOString().split('T')[0]
    });
  }

  const completedCount = mockTests.filter(m => m.date.startsWith(monthStr) && m.completed).length;
  const completionPercentage = Math.round((completedCount / daysInMonth) * 100);

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-pink-500" />
            Daily Mock Test Habit Tracker
          </h3>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Check off daily mock tests to build consistent exam stamina 🌸
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">
            {completedCount} / {daysInMonth} Done ({completionPercentage}%)
          </div>

          <div className="flex items-center gap-1 bg-pink-50 dark:bg-plum-900 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-pink-900 dark:text-pink-100 font-outfit min-w-[100px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day} className="text-[11px] font-bold text-pink-400 dark:text-pink-300/60 uppercase tracking-wider py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {daysArray.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="h-10 rounded-lg bg-transparent" />;
          }

          return (
            <button
              key={item.dateStr}
              onClick={() => onToggleMockTest({ date: item.dateStr, completed: !item.isCompleted })}
              className={`h-11 rounded-2xl p-1 flex flex-col items-center justify-between border transition-all ${
                item.isCompleted
                  ? 'bg-gradient-to-tr from-rose-500/20 to-pink-500/15 border-rose-400 text-rose-800 dark:text-rose-200 hover:bg-rose-500/25'
                  : item.isToday
                  ? 'bg-pink-500/15 border-pink-500 text-pink-950 dark:text-pink-100 hover:bg-pink-500/25'
                  : 'bg-slate-50/70 dark:bg-plum-900/40 border-slate-200/80 dark:border-pink-950/60 text-slate-700 dark:text-pink-200 hover:border-pink-300 dark:hover:border-pink-800'
              }`}
            >
              <span className="text-[11px] font-mono font-bold leading-none">{item.dayNum}</span>
              {item.isCompleted ? (
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-pink-200 dark:text-pink-950" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
