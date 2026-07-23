import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Timer } from 'lucide-react';

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

      playTone(523.25, 0, 0.4);
      playTone(659.25, 0.2, 0.4);
      playTone(783.99, 0.4, 0.6);
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
    <div className="dashboard-card space-y-5 flex flex-col items-center text-center">
      <div className="w-full flex items-center justify-between gap-2">
        <div className="text-left min-w-0">
          <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#787774] shrink-0" /> Pomodoro Focus Timer
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] mt-0.5">
            Cycle #{cycleCount} &bull; {mode === 'work' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] border border-[#E9E9E7] dark:border-[#2E2E2E] whitespace-nowrap">
          {mode === 'work' ? 'Focus 25m' : mode === 'shortBreak' ? 'Short Break 5m' : 'Long Break 15m'}
        </span>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center gap-1 bg-[#F7F7F5] dark:bg-[#202020] p-1 rounded border border-[#E9E9E7] dark:border-[#2E2E2E] w-full">
        <button
          onClick={() => { setIsRunning(false); setMode('work'); }}
          className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
            mode === 'work' ? 'bg-white dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => { setIsRunning(false); setMode('shortBreak'); }}
          className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
            mode === 'shortBreak' ? 'bg-white dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => { setIsRunning(false); setMode('longBreak'); }}
          className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
            mode === 'longBreak' ? 'bg-white dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#787774] dark:text-[#9B9B9B]'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* SVG Circular Timer */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-[#E9E9E7] dark:stroke-[#2E2E2E]"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-[#37352F] dark:stroke-[#E3E3E0] transition-all duration-1000"
            strokeWidth="6"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-semibold font-mono tracking-tight text-[#37352F] dark:text-[#E3E3E0]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#787774] dark:text-[#9B9B9B] uppercase tracking-wider font-medium mt-1">
            {isRunning ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetTimer}
          className="w-10 h-10 flex items-center justify-center rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleStart}
          className="h-10 px-6 rounded font-medium text-sm bg-[#37352F] dark:bg-[#E3E3E0] text-white dark:text-[#191919] hover:bg-[#2A2A28] dark:hover:bg-[#D0D0CD] transition-colors flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-4 h-4 fill-white dark:fill-[#191919]" /> : <Play className="w-4 h-4 fill-white dark:fill-[#191919] ml-0.5" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={skipSession}
          className="w-10 h-10 flex items-center justify-center rounded bg-white dark:bg-[#2A2A2A] border border-[#E9E9E7] dark:border-[#2E2E2E] text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
          title="Skip Session"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Log Settings */}
      <div className="w-full pt-3 border-t border-[#E9E9E7] dark:border-[#2E2E2E] space-y-2 text-left">
        <label className="flex items-center gap-2 text-xs font-medium text-[#37352F] dark:text-[#E3E3E0] cursor-pointer">
          <input
            type="checkbox"
            checked={autoLog}
            onChange={(e) => setAutoLog(e.target.checked)}
            className="rounded border-[#E9E9E7] accent-[#37352F]"
          />
          <span>Auto-log completed focus session to study graph</span>
        </label>

        {autoLog && (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs text-[#787774] dark:text-[#9B9B9B]">Log under:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="notion-input text-xs py-1"
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
