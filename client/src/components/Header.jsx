import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Flame, Settings, Clock, Calendar, Sparkles } from 'lucide-react';

export default function Header({ streakData, onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#202020] border-b border-[#E9E9E7] dark:border-[#2E2E2E] px-4 lg:px-8 py-3 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding & Date */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F7F7F5] dark:bg-[#2D2D2D] border border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-center text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0]">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-[#37352F] dark:text-[#E3E3E0]">
                CFTRI & CUET Exam Prep
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-normal bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E]">
                <Sparkles className="w-3 h-3 text-[#787774]" /> Notion Prep Space
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9B9B] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#787774]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Live Clock (12-Hour), Streak & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-xs font-mono font-medium text-[#37352F] dark:text-[#E3E3E0]">
            <Clock className="w-3.5 h-3.5 text-[#787774]" />
            <span>{formattedTime}</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-xs font-medium text-[#37352F] dark:text-[#E3E3E0]">
            <Flame className="w-3.5 h-3.5 text-[#787774]" />
            <span>{streakData?.currentStreak || 0} Day Streak</span>
            <span className="text-[#9B9A97] dark:text-[#777777] text-[11px]">
              (Best: {streakData?.longestStreak || 0})
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] dark:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] dark:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
            title="Configure Exam Dates & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
