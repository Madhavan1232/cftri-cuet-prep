import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Tag, CheckCircle2, Circle } from 'lucide-react';

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

  const getTagBadgeClass = (t) => {
    switch (t) {
      case 'CFTRI':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'CUET':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Admission Timeline & Milestones
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key entrance exam dates, application deadlines & counselling milestones
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Add Event Form Modal / Collapse */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Add New Timeline Milestone
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Admit Card Release Date"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Event Date</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Category Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="CFTRI">CFTRI</option>
                <option value="CUET">CUET</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Notes / Instructions</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Keep roll number handy"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Save Event
            </button>
          </div>
        </form>
      )}

      {/* Stepper Visualization */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {events.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No timeline events added yet.</p>
        ) : (
          events.map((evt, idx) => {
            const evtDate = new Date(evt.date);
            const isPast = evtDate < new Date();
            return (
              <div key={evt._id || idx} className="relative group">
                {/* Bullet Node */}
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 ${isPast ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 fill-emerald-500/20 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                  )}
                </div>

                <div className="flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTagBadgeClass(evt.tag)}`}>
                        {evt.tag}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {evt.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{evtDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </p>

                    {evt.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                        {evt.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteEvent(evt._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
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
