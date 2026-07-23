import React, { useState, useEffect } from 'react';
import { Calendar, Edit2 } from 'lucide-react';

export default function CountdownCard({ title, targetDate, onEdit }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const formattedTarget = new Date(targetDate).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const units = [
    { label: 'Days',  value: timeLeft.days },
    { label: 'Hrs',   value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Mins',  value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Secs',  value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="dashboard-card">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E] mb-1.5">
            Target Exam
          </span>
          <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0] leading-snug">
            {title}
          </h3>
        </div>
        <button
          onClick={onEdit}
          className="w-7 h-7 shrink-0 flex items-center justify-center rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
          title="Edit Target Date"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date sub-label */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#9B9B9B] mb-3">
        <Calendar className="w-3.5 h-3.5 shrink-0" />
        <span>Target: {formattedTarget}</span>
      </div>

      {/* Countdown tiles — equal width, equal height */}
      <div className="grid grid-cols-4 gap-2">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-0.5 py-3 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]"
          >
            <span className="text-xl sm:text-2xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0] leading-none">
              {value}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-[#787774] dark:text-[#9B9B9B]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
