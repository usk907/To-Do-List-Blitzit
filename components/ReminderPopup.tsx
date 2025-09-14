import React from 'react';
import { Task } from '../types';

interface ReminderPopupProps {
  task: Task;
  onClose: () => void;
  onMarkDone: (id: string) => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ task, onClose, onMarkDone }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold text-yellow-300 mb-2">Reminder!</h2>
        <p className="text-xl text-white mb-6">
          Your task is overdue: <span className="font-bold">"{task.title}"</span>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => onMarkDone(task.id)}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Mark as Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup;
