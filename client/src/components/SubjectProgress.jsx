import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Tag } from 'lucide-react';

export default function SubjectProgress({ subjects = [], onUpdateSubject, onAddSubject, onDeleteSubject }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('CFTRI');
  const [color, setColor] = useState('#787774');

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
      <div key={subj._id} className="p-3 rounded-lg bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] space-y-2 group transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: subj.color || '#787774' }}
            />
            <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0]">
              {subj.name}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-medium text-[#787774] dark:text-[#9B9B9B]">
              {subj.progress}%
            </span>
            <button
              onClick={() => onDeleteSubject(subj._id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#787774] hover:text-red-500 rounded transition-all"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Slider */}
        <div className="space-y-1">
          <div className="w-full bg-[#F1F1EF] dark:bg-[#2D2D2D] h-2 rounded overflow-hidden border border-[#E9E9E7] dark:border-[#2E2E2E]">
            <div
              className="h-full rounded transition-all duration-300 bg-[#37352F] dark:bg-[#E3E3E0]"
              style={{
                width: `${subj.progress}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9B9B] pt-0.5">
            <span>Completion:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={subj.progress}
              onChange={(e) => onUpdateSubject(subj._id, { progress: Number(e.target.value) })}
              className="w-28 accent-[#37352F] dark:accent-[#E3E3E0] cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#787774]" />
            Subject-wise Syllabus Progress
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
            Track and update syllabus completion percentage per subject
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="notion-btn text-xs py-1 px-2.5 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-3 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] space-y-2.5">
          <h4 className="text-xs font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">
            Create New Subject
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subject Name"
                className="notion-input w-full text-xs"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="notion-input w-full text-xs"
              >
                <option value="CFTRI">CFTRI</option>
                <option value="CUET">CUET</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 p-0 rounded border border-[#E9E9E7] bg-white cursor-pointer shrink-0"
              />
              <button
                type="submit"
                className="notion-btn w-full text-xs py-1"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Subjects by Category */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold uppercase text-[#787774] dark:text-[#9B9B9B] mb-2 flex items-center gap-1.5">
            CFTRI Entrance Subjects
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {cftriSubjects.map(renderSubjectCard)}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase text-[#787774] dark:text-[#9B9B9B] mb-2 flex items-center gap-1.5">
            CUET Entrance Subjects
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {cuetSubjects.map(renderSubjectCard)}
          </div>
        </div>

        {otherSubjects.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-[#787774] dark:text-[#9B9B9B] mb-2">
              General / Additional Subjects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {otherSubjects.map(renderSubjectCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
