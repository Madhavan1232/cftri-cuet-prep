import React from 'react';
import {
  Sparkles,
  BookOpen,
  Timer,
  CheckSquare,
  FileText,
  Settings,
  Heart
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSettings }) {
  const navItems = [
    { id: 'overview', label: 'Dashboard Sanctuary', icon: Sparkles },
    { id: 'tracker', label: 'Study & Progress', icon: BookOpen },
    { id: 'pomodoro', label: 'Focus Pomodoro', icon: Timer },
    { id: 'revision', label: 'Saturday Revision', icon: CheckSquare },
    { id: 'notes', label: 'Notes Vault', icon: FileText },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white/80 dark:bg-plum-950/90 border-r border-pink-100 dark:border-pink-950/80 p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        <div className="px-3 py-1 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-pink-400 dark:text-pink-300/60">
            Study Menu ✨
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                    : 'text-slate-600 dark:text-pink-200/70 hover:bg-pink-50 dark:hover:bg-plum-900/80 hover:text-pink-600 dark:hover:text-pink-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-400 dark:text-pink-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Motivational Card & Settings */}
      <div className="pt-4 mt-auto space-y-3 border-t border-pink-100 dark:border-pink-950/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 border border-pink-200/50 dark:border-pink-900/40 text-center space-y-1">
          <p className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Daily Reminder
          </p>
          <p className="text-[11px] text-slate-600 dark:text-pink-200/80 italic">
            "Believe in your hard work. Future M.Sc. ranker loading..."
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-pink-200/70 hover:bg-pink-50 dark:hover:bg-plum-900/80 hover:text-pink-600 dark:hover:text-pink-100 transition-colors"
        >
          <Settings className="w-4 h-4 text-pink-400" />
          <span>Dashboard Settings</span>
        </button>
      </div>
    </aside>
  );
}
