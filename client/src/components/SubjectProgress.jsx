import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Heart, Sparkles } from 'lucide-react';

export default function SubjectProgress({ subjects = [], onUpdateSubject, onAddSubject, onDeleteSubject }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('CFTRI');
  const [color, setColor] = useState('#ec4899');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAddSubject({ name, category, color, progress: 0 });
    setName('');
    setCategory('CFTRI');
    setShowAddForm(false);
  };

  const cftriSubjects = subjects.filter(s => s.category === 'CFTRI');
  const cuetSubjects = subjects.filter(s => s.category === 'CUET');
  const otherSubjects = subjects.filter(s => s.category !== 'CFTRI' && s.category !== 'CUET');

  const renderSubjectCard = (subj) => {
    return (
      <div key={subj._id} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-plum-900/50 border border-pink-100 dark:border-pink-950/60 space-y-2 group transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: subj.color || '#ec4899' }}
            />
            <h4 className="text-sm font-bold text-slate-900 dark:text-pink-50">
              {subj.name}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
              {subj.progress}%
            </span>
            <button
              onClick={() => onDeleteSubject(subj._id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-all"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Slider */}
        <div className="space-y-1">
          <div className="w-full bg-pink-100 dark:bg-plum-950/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-pink-200/50 dark:border-pink-900/40">
            <div
              className="h-full rounded-full transition-all duration-300 shadow-sm"
              style={{
                width: `${subj.progress}%`,
                backgroundColor: subj.color || '#ec4899'
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-pink-300/70 pt-1">
            <span>Adjust completion:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={subj.progress}
              onChange={(e) => onUpdateSubject(subj._id, { progress: Number(e.target.value) })}
              className="w-32 accent-pink-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-pink-500" />
            Subject-wise Syllabus Progress
          </h3>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Track and update syllabus completion % per subject
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm shadow-pink-500/25"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-pink-50/60 dark:bg-plum-900/60 border border-pink-200 dark:border-pink-900/60 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
            Create New Subject
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-pink-200 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Food Technology 🌸"
                className="w-full px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-pink-200 mb-1">Exam Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="CFTRI">CFTRI</option>
                <option value="CUET">CUET</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-pink-200 mb-1">Pastel Color Tag</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-9 p-0.5 rounded-lg border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 cursor-pointer"
                />
                <span className="text-xs font-mono text-pink-500">{color}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-plum-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-pink-500 text-white hover:bg-pink-600 shadow-sm"
            >
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Grid of Subjects by Category */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-1.5">
            CFTRI Entrance Subjects ✨
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cftriSubjects.map(renderSubjectCard)}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1.5">
            CUET Entrance Subjects 💖
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cuetSubjects.map(renderSubjectCard)}
          </div>
        </div>

        {otherSubjects.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-pink-300/60 mb-2">
              General / Additional Subjects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherSubjects.map(renderSubjectCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
