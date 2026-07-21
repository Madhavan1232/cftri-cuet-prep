import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Sparkles } from 'lucide-react';

export default function CountdownCard({ title, targetDate, badgeColor = 'rose', onEdit }) {
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

  const colorVariants = {
    rose: {
      border: 'border-pink-200 dark:border-pink-900/60',
      badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/20',
      gradient: 'from-pink-500 via-rose-400 to-purple-400',
      timeBg: 'bg-pink-50/70 dark:bg-plum-900/60 text-pink-950 dark:text-pink-100 border-pink-200/60 dark:border-pink-900/40'
    },
    purple: {
      border: 'border-purple-200 dark:border-purple-900/60',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
      gradient: 'from-purple-500 via-pink-400 to-indigo-400',
      timeBg: 'bg-purple-50/70 dark:bg-plum-900/60 text-purple-950 dark:text-purple-100 border-purple-200/60 dark:border-purple-900/40'
    }
  };

  const currentVariant = colorVariants[badgeColor] || colorVariants.rose;

  const formattedTargetDate = new Date(targetDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={`dashboard-card relative overflow-hidden border ${currentVariant.border}`}>
      {/* Background glow */}
      <div className={`absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br ${currentVariant.gradient} opacity-15 blur-2xl pointer-events-none`} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentVariant.badge} mb-1.5`}>
            <Sparkles className="w-3 h-3" /> Target Exam Countdown
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-pink-50 font-outfit">
            {title}
          </h3>
        </div>

        <button
          onClick={onEdit}
          className="p-1.5 rounded-xl text-pink-400 hover:text-pink-600 dark:hover:text-pink-200 hover:bg-pink-50 dark:hover:bg-plum-800 transition-colors"
          title="Edit Target Date"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-pink-300/70 mb-4">
        <Calendar className="w-3.5 h-3.5 text-pink-400" />
        <span>Target Date: {formattedTargetDate}</span>
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${currentVariant.timeBg}`}>
          <span className="text-2xl font-bold font-mono tracking-tight">{timeLeft.days}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Days</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${currentVariant.timeBg}`}>
          <span className="text-2xl font-bold font-mono tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Hours</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${currentVariant.timeBg}`}>
          <span className="text-2xl font-bold font-mono tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Mins</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${currentVariant.timeBg}`}>
          <span className="text-2xl font-bold font-mono tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Secs</span>
        </div>
      </div>
    </div>
  );
}
