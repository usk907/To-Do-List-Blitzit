import React, { useState, useEffect } from 'react';
import { Task, Priority, Recurrence } from '../types';

interface EditTaskModalProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState<Task>(task);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-700/50 text-slate-200 placeholder-slate-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-slate-400 mb-1">Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-slate-400 mb-1">Time</label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime || ''}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="recurrence" className="block text-sm font-medium text-slate-400 mb-1">Recurrence</label>
              <select
                id="recurrence"
                name="recurrence"
                value={formData.recurrence}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                {Object.values(Recurrence).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
