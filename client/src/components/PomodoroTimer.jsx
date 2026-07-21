import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, Heart } from 'lucide-react';

export default function PomodoroTimer({
  workMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  subjects = [],
  onLogStudySession
}) {
  const [mode, setMode] = useState('work');
  const [cycleCount, setCycleCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [autoLog, setAutoLog] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');

  const totalDuration = (mode === 'work' ? workMinutes : mode === 'shortBreak' ? shortBreakMinutes : longBreakMinutes) * 60;

  useEffect(() => {
    setTimeLeft((mode === 'work' ? workMinutes : mode === 'shortBreak' ? shortBreakMinutes : longBreakMinutes) * 60);
  }, [workMinutes, shortBreakMinutes, longBreakMinutes, mode]);

  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.4); // C5
      playTone(659.25, 0.2, 0.4); // E5
      playTone(783.99, 0.4, 0.6); // G5
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playAudioChime();

      if (mode === 'work') {
        if (autoLog && onLogStudySession) {
          const subjName = selectedSubject || subjects[0]?.name || 'General Study';
          const today = new Date().toISOString().split('T')[0];
          onLogStudySession({ date: today, subjectName: subjName, hours: Number((workMinutes / 60).toFixed(2)) });
        }

        if (cycleCount % 4 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        if (mode === 'longBreak') {
          setCycleCount(1);
        } else {
          setCycleCount(prev => prev + 1);
        }
        setMode('work');
      }
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, cycleCount, autoLog, workMinutes, selectedSubject, subjects]);

  const toggleStart = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode(cycleCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      if (mode === 'longBreak') setCycleCount(1);
      else setCycleCount(prev => prev + 1);
      setMode('work');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <div className="dashboard-card space-y-6 flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500" /> Focus Pomodoro Sanctuary
          </h3>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Cycle #{cycleCount} • {mode === 'work' ? 'Deep Focus Session 🌸' : mode === 'shortBreak' ? 'Short Rest ☕' : 'Long Rest 🌿'}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          mode === 'work'
            ? 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/20'
            : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
        }`}>
          {mode === 'work' ? '💖 Focus 25m' : mode === 'shortBreak' ? '🍵 Rest 5m' : '🌴 Rest 15m'}
        </span>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center gap-1 bg-pink-50 dark:bg-plum-900 p-1 rounded-2xl w-full">
        <button
          onClick={() => { setIsRunning(false); setMode('work'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'work' ? 'bg-white dark:bg-plum-800 text-pink-600 dark:text-pink-300 shadow-sm' : 'text-slate-500 dark:text-pink-300/60'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => { setIsRunning(false); setMode('shortBreak'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'shortBreak' ? 'bg-white dark:bg-plum-800 text-purple-600 dark:text-purple-300 shadow-sm' : 'text-slate-500 dark:text-pink-300/60'
          }`}
        >
          Short Rest (5m)
        </button>
        <button
          onClick={() => { setIsRunning(false); setMode('longBreak'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'longBreak' ? 'bg-white dark:bg-plum-800 text-rose-600 dark:text-rose-300 shadow-sm' : 'text-slate-500 dark:text-pink-300/60'
          }`}
        >
          Long Rest (15m)
        </button>
      </div>

      {/* SVG Circular Timer */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-pink-100 dark:stroke-pink-950/60"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className={`transition-all duration-1000 ${
              mode === 'work' ? 'stroke-pink-500' : 'stroke-purple-400'
            }`}
            strokeWidth="10"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-pink-50">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-pink-500 dark:text-pink-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
            {isRunning ? <Sparkles className="w-3 h-3 animate-spin" /> : null}
            {isRunning ? 'Flowing...' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-pink-50 dark:bg-plum-900 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleStart}
          className={`px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${
            isRunning
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-amber-500/20'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-pink-500/30'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          <span>{isRunning ? 'Pause' : 'Start Focus ✨'}</span>
        </button>

        <button
          onClick={skipSession}
          className="p-3 rounded-full bg-pink-50 dark:bg-plum-900 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
          title="Skip Session"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Auto-Log Settings */}
      <div className="w-full pt-4 border-t border-pink-100 dark:border-pink-950/80 space-y-2 text-left">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-pink-200 cursor-pointer">
          <input
            type="checkbox"
            checked={autoLog}
            onChange={(e) => setAutoLog(e.target.checked)}
            className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
          />
          <span>Auto-log completed focus session to study graph 💖</span>
        </label>

        {autoLog && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 dark:text-pink-300/70">Log under:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 dark:bg-plum-900 text-xs font-medium"
            >
              {subjects.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
