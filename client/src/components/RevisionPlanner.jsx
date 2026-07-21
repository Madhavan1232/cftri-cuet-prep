import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';

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
    <div className="dashboard-card space-y-4">
      {/* Saturday Highlight Banner */}
      {isSaturday ? (
        <div className="p-3 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#787774]" />
            <div>
              <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0]">
                Saturday Revision Day
              </h4>
              <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
                Time to review pending revision tasks and reinforce core concepts.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#787774] dark:text-[#9B9B9B]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Saturday Revision Planner (Backlog checklist)</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#787774]" />
            Revision Checklist & Backlog Planner
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
            {completedCount} of {tasks.length} revision tasks completed
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
          placeholder="e.g. Revise Organic Chemistry Mechanisms & MCQs"
          className="notion-input flex-1 text-xs"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="notion-input text-xs font-medium"
        >
          <option value="CFTRI">CFTRI</option>
          <option value="CUET">CUET</option>
          <option value="General">General</option>
        </select>

        <button
          type="submit"
          className="notion-btn text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-1.5">
        {tasks.length === 0 ? (
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] italic py-3 text-center">No revision tasks added yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-2.5 rounded border transition-colors ${
                task.completed
                  ? 'bg-[#F9F9F8] dark:bg-[#202020] border-[#E9E9E7] dark:border-[#2E2E2E] opacity-70'
                  : 'bg-white dark:bg-[#252525] border-[#E9E9E7] dark:border-[#2E2E2E]'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task._id, !task.completed)}
                  className="text-[#787774] hover:text-[#37352F] dark:hover:text-[#E3E3E0] transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#37352F] dark:text-[#E3E3E0]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#D3D3D0] dark:text-[#3E3E3E]" />
                  )}
                </button>

                <span className={`text-xs font-medium truncate ${task.completed ? 'line-through text-[#787774] dark:text-[#9B9B9B]' : 'text-[#37352F] dark:text-[#E3E3E0]'}`}>
                  {task.title}
                </span>

                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] shrink-0">
                  {task.category}
                </span>
              </div>

              <button
                onClick={() => onDeleteTask(task._id)}
                className="p-1 text-[#787774] hover:text-red-500 rounded transition-colors ml-2"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
