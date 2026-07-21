import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Sparkles, CheckCircle2, Circle, Heart } from 'lucide-react';

export default function RevisionPlanner({ tasks = [], onAddTask, onToggleTask, onDeleteTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CFTRI');

  const isSaturday = new Date().getDay() === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAddTask({ title, category });
    setTitle('');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="dashboard-card space-y-5">
      {/* Saturday Highlight Banner */}
      {isSaturday ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-rose-500/15 to-purple-500/20 border border-pink-300 dark:border-pink-800/60 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-bold shadow-md shadow-pink-500/30">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-pink-950 dark:text-pink-100 flex items-center gap-1.5">
                Saturday Revision & Glow Up Day! 🌸
              </h4>
              <p className="text-xs text-pink-900/80 dark:text-pink-200/80">
                Time to clear weekly backlogs, review key formulas, and celebrate your progress! ✨
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-pink-700 dark:text-pink-300">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Saturday Revision Planner (Continuous revision vault)</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-pink-500" />
            Revision Checklist & Backlog Planner
          </h3>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            {completedCount} of {tasks.length} revision items completed ✨
          </p>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Revise Food Chemistry reaction mechanisms 💖"
          className="flex-1 px-3.5 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-xs font-semibold"
        >
          <option value="CFTRI">CFTRI</option>
          <option value="CUET">CUET</option>
          <option value="General">General</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-1 shrink-0 shadow-sm shadow-pink-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">No revision tasks added yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-pink-50/40 dark:bg-plum-900/20 border-pink-100/40 dark:border-pink-950/40 opacity-70'
                  : 'bg-slate-50/70 dark:bg-plum-900/50 border-slate-200/80 dark:border-pink-950/60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task._id, !task.completed)}
                  className="text-pink-400 hover:text-pink-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-pink-500 fill-pink-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-pink-300 dark:text-pink-900" />
                  )}
                </button>

                <span className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400 dark:text-pink-300/50' : 'text-slate-800 dark:text-pink-100'}`}>
                  {task.title}
                </span>

                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 shrink-0">
                  {task.category}
                </span>
              </div>

              <button
                onClick={() => onDeleteTask(task._id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors ml-2"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
