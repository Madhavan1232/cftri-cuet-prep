import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  CheckSquare,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSettings }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tracker', label: 'Study & Progress', icon: BookOpen },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
    { id: 'revision', label: 'Saturday Revision', icon: CheckSquare },
    { id: 'notes', label: 'Notes Vault', icon: FileText },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#F7F7F5] dark:bg-[#202020] border-r border-[#E9E9E7] dark:border-[#2E2E2E] p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-4">
        <div className="px-2 py-1 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-[#787774] dark:text-[#9B9B9B]">
            Workspace
          </p>
        </div>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EFEFED] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E3E3E0] font-semibold'
                    : 'text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#E3E3E0]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#37352F] dark:text-[#E3E3E0]' : 'text-[#787774] dark:text-[#9B9B9B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="pt-3 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#E3E3E0] transition-colors"
        >
          <Settings className="w-4 h-4 text-[#787774] dark:text-[#9B9B9B]" />
          <span>Dashboard Settings</span>
        </button>
      </div>
    </aside>
  );
}
