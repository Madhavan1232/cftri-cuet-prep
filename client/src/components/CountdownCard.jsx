import React, { useState, useEffect } from 'react';
import { Calendar, Edit2 } from 'lucide-react';

export default function CountdownCard({ title, targetDate, onEdit }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formattedTargetDate = new Date(targetDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="dashboard-card relative">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E] mb-1.5">
            Target Exam
          </span>
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0]">
            {title}
          </h3>
        </div>

        <button
          onClick={onEdit}
          className="p-1 rounded text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
          title="Edit Target Date"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9B9B] mb-3">
        <Calendar className="w-3.5 h-3.5 text-[#787774]" />
        <span>Target Date: {formattedTargetDate}</span>
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center justify-center p-2 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <span className="text-xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0]">{timeLeft.days}</span>
          <span className="text-[10px] font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">Days</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <span className="text-xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0]">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">Hours</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <span className="text-xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0]">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">Mins</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <span className="text-xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0]">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">Secs</span>
        </div>
      </div>
    </div>
  );
}
