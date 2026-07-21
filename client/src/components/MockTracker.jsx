import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

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
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#787774]" />
            Daily Mock Test Habit Tracker
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
            Check off daily mock tests to build consistent exam stamina
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-medium px-2 py-0.5 rounded bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E]">
            {completedCount} / {daysInMonth} Done ({completionPercentage}%)
          </div>

          <div className="flex items-center gap-1 bg-[#F7F7F5] dark:bg-[#202020] p-1 rounded border border-[#E9E9E7] dark:border-[#2E2E2E]">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold px-1 text-[#37352F] dark:text-[#E3E3E0] min-w-[90px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] rounded transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day} className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9B9B] uppercase tracking-wider py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {daysArray.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="h-10 rounded bg-transparent" />;
          }

          return (
            <button
              key={item.dateStr}
              onClick={() => onToggleMockTest({ date: item.dateStr, completed: !item.isCompleted })}
              className={`h-10 rounded p-1 flex flex-col items-center justify-between border transition-all ${
                item.isCompleted
                  ? 'bg-[#F1F1EF] dark:bg-[#2D2D2D] border-[#37352F] dark:border-[#666666] text-[#37352F] dark:text-[#E3E3E0]'
                  : item.isToday
                  ? 'bg-white dark:bg-[#252525] border-[#37352F] dark:border-[#666666] text-[#37352F] dark:text-[#E3E3E0]'
                  : 'bg-white dark:bg-[#252525] border-[#E9E9E7] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333]'
              }`}
            >
              <span className="text-[11px] font-mono font-medium leading-none">{item.dayNum}</span>
              {item.isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#37352F] dark:text-[#E3E3E0]" />
              ) : (
                <Circle className="w-3 h-3 text-[#E9E9E7] dark:text-[#3E3E3E]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
