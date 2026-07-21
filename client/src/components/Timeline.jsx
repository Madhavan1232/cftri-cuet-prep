import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function Timeline({ events = [], onAddEvent, onDeleteEvent }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tag, setTag] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddEvent({ title, date, notes, tag });
    setTitle('');
    setDate('');
    setNotes('');
    setTag('General');
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#787774]" />
            Admission Timeline & Milestones
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
            Key entrance exam dates, application deadlines & counselling milestones
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="notion-btn text-xs py-1 px-2.5 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-3 rounded bg-[#F7F7F5] dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] space-y-2.5">
          <h4 className="text-xs font-medium uppercase text-[#787774] dark:text-[#9B9B9B]">
            Add New Timeline Milestone
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[#787774] mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Admit Card Release Date"
                className="notion-input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-[#787774] mb-1">Event Date</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="notion-input w-full text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[#787774] mb-1">Category Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="notion-input w-full text-xs"
              >
                <option value="General">General</option>
                <option value="CFTRI">CFTRI</option>
                <option value="CUET">CUET</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#787774] mb-1">Notes / Instructions</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Keep roll number handy"
                className="notion-input w-full text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="notion-btn text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="notion-btn text-xs bg-[#37352F] text-white dark:bg-[#E3E3E0] dark:text-[#191919]"
            >
              Save Event
            </button>
          </div>
        </form>
      )}

      {/* Stepper Visualization */}
      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E9E9E7] dark:before:bg-[#2E2E2E]">
        {events.length === 0 ? (
          <p className="text-xs text-[#787774] italic py-2">No timeline events added yet.</p>
        ) : (
          events.map((evt, idx) => {
            const evtDate = new Date(evt.date);
            const isPast = evtDate < new Date();
            return (
              <div key={evt._id || idx} className="relative group">
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-[#252525] border border-[#787774] flex items-center justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-[#787774]' : 'bg-[#37352F] dark:bg-[#E3E3E0]'}`} />
                </div>

                <div className="flex items-start justify-between bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] rounded p-2.5 hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B]">
                        {evt.tag}
                      </span>
                      <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0]">
                        {evt.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-[#787774] dark:text-[#9B9B9B]">
                      {evtDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>

                    {evt.notes && (
                      <p className="text-xs text-[#37352F] dark:text-[#E3E3E0] pt-0.5">
                        {evt.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteEvent(evt._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#787774] hover:text-red-500 rounded transition-all"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
