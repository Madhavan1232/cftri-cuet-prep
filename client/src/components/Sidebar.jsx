import React from 'react';
import {
  LayoutDashboard, BookOpen, Timer, CheckSquare, FileText, Settings
} from 'lucide-react';

const navItems = [
  { id: 'overview',  label: 'Overview',          icon: LayoutDashboard },
  { id: 'tracker',   label: 'Study & Progress',   icon: BookOpen },
  { id: 'pomodoro',  label: 'Pomodoro Timer',     icon: Timer },
  { id: 'revision',  label: 'Saturday Revision',  icon: CheckSquare },
  { id: 'notes',     label: 'Notes Vault',        icon: FileText },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenSettings }) {
  return (
    <aside className="
      w-full lg:w-56 xl:w-60 shrink-0
      bg-[#F7F7F5] dark:bg-[#202020]
      border-b lg:border-b-0 lg:border-r
      border-[#E9E9E7] dark:border-[#2E2E2E]
      transition-colors
    ">
      {/* Mobile: horizontal scrollable nav */}
      <div className="lg:hidden overflow-x-auto">
        <nav className="flex items-center gap-1 px-3 py-2 min-w-max">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-white dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                    : 'text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#E3E3E0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop: vertical nav */}
      <div className="hidden lg:flex flex-col justify-between h-full p-3">
        <div className="space-y-4">
          {/* Section label */}
          <div className="px-2 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#787774] dark:text-[#9B9B9B]">
              Workspace
            </p>
          </div>

          <nav className="space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 h-8 rounded text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#EFEFED] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0]'
                      : 'text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#E3E3E0]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#37352F] dark:text-[#E3E3E0]' : 'text-[#787774] dark:text-[#9B9B9B]'}`} />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings */}
        <div className="pt-3 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-2.5 h-8 rounded text-sm font-medium text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#E3E3E0] transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0 text-[#787774] dark:text-[#9B9B9B]" />
            <span className="truncate">Dashboard Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
