import React, { useState } from 'react';
import { Priority, Recurrence } from '../types';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';

interface TaskInputProps {
  onAddTask: (title: string, priority: Priority, dueDate: string | undefined, dueTime: string | undefined, recurrence: Recurrence) => void;
  onGenerateTasks: (goal: string) => Promise<void>;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, onGenerateTasks }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>(Recurrence.NONE);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), priority, dueDate || undefined, dueTime || undefined, recurrence);
      setTitle('');
      setDueDate('');
      setDueTime('');
      setRecurrence(Recurrence.NONE);
    }
  };

  const handleGenerate = async () => {
    if (title.trim() && !isGenerating) {
      setIsGenerating(true);
      await onGenerateTasks(title.trim());
      setTitle('');
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 bg-slate-900/50 rounded-lg flex flex-col sm:flex-row items-center gap-2 mb-4">
      <div className="relative flex-grow w-full">
         <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task or describe a goal..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 py-3 pl-4 pr-10 focus:outline-none"
          disabled={isGenerating}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          title="Generate sub-tasks with AI"
        >
          {isGenerating ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
        <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-slate-700/50 text-slate-300 rounded-md px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="bg-slate-700/50 text-slate-300 rounded-md px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as Recurrence)}
          className="bg-slate-700/50 text-slate-300 rounded-md pl-2 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
        >
          {Object.values(Recurrence).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="bg-slate-700/50 text-slate-300 rounded-md pl-2 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
         <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-3 transition-colors disabled:bg-slate-600" disabled={isGenerating}>
            <PlusIcon className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
};

export default TaskInput;
