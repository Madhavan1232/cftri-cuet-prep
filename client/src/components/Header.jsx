import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Flame, Settings, Clock, Calendar, Sparkles } from 'lucide-react';

export default function Header({ streakData, onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#202020] border-b border-[#E9E9E7] dark:border-[#2E2E2E] transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 min-h-[52px]">

        {/* ── Left: Branding ── */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo badge */}
          <div className="w-8 h-8 shrink-0 rounded bg-[#F7F7F5] dark:bg-[#2D2D2D] border border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-center text-sm select-none">
            🎓
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-semibold tracking-tight text-[#37352F] dark:text-[#E3E3E0] whitespace-nowrap">
                CFTRI &amp; CUET Prep
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-normal bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E] whitespace-nowrap">
                <Sparkles className="w-3 h-3" /> Notion Prep Space
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#9B9B9B] mt-0.5">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* ── Right: Controls ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 rounded bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[11px] font-mono font-medium text-[#37352F] dark:text-[#E3E3E0] whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-[#787774] shrink-0" />
            <span>{formattedTime}</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 h-8 rounded bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[11px] font-medium text-[#37352F] dark:text-[#E3E3E0] whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-[#787774] shrink-0" />
            <span>{streakData?.currentStreak || 0}d</span>
            <span className="hidden md:inline text-[#9B9A97] dark:text-[#777777]">
              (Best: {streakData?.longestStreak || 0})
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-[#E9E9E7] dark:bg-[#2E2E2E]" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] dark:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] dark:text-[#E3E3E0] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors shrink-0"
            title="Configure Exam Dates & Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
