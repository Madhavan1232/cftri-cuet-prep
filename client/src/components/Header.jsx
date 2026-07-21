import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Flame, Settings, Clock, Calendar, Sparkles, Heart } from 'lucide-react';

export default function Header({ streakData, onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 12-Hour format with AM/PM
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
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-plum-950/80 backdrop-blur-md border-b border-pink-100 dark:border-pink-950/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-400 flex items-center justify-center text-white shadow-md shadow-pink-500/25 font-bold text-xl font-outfit">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-pink-50 font-outfit leading-tight">
                CFTRI & CUET Prep Sanctuary
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50">
                <Sparkles className="w-3 h-3 text-pink-500" /> You've got this!
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-pink-300/70">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Live Clock (12-Hour), Streak & Theme */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live 12-Hour Clock Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-plum-900 text-pink-900 dark:text-pink-100 font-mono text-sm font-bold border border-pink-200/70 dark:border-pink-900/50 shadow-sm">
            <Clock className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>{formattedTime}</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
            <span>{streakData?.currentStreak || 0} Day Streak</span>
            <span className="text-pink-400 dark:text-pink-400/60 text-[10px] ml-0.5">
              (Best: {streakData?.longestStreak || 0})
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-pink-50 dark:bg-plum-900 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-purple-600" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-pink-50 dark:bg-plum-900 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
            title="Configure Exam Dates & Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
