import React from 'react';
import { Task, Priority, Recurrence } from '../types';
import TrashIcon from './icons/TrashIcon';
import CalendarIcon from './icons/CalendarIcon';
import RepeatIcon from './icons/RepeatIcon';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityClasses: Record<Priority, { dot: string; text: string }> = {
  [Priority.HIGH]: { dot: 'bg-red-400', text: 'text-red-400' },
  [Priority.MEDIUM]: { dot: 'bg-yellow-400', text: 'text-yellow-400' },
  [Priority.LOW]: { dot: 'bg-green-400', text: 'text-green-400' },
};

const formatTimeToAMPM = (timeString?: string): string | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};


const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const formattedDueDate = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;
  const isRecurring = task.recurrence !== Recurrence.NONE;
  
  const formattedDueTime = formatTimeToAMPM(task.dueTime);

  return (
    <div className="group flex items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200">
      <div className="flex items-center flex-grow">
        <div className={`w-2.5 h-2.5 rounded-full mr-4 flex-shrink-0 ${priorityClasses[task.priority].dot}`}></div>
        <label className="flex items-center cursor-pointer flex-grow">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="hidden"
          />
          <div className={`w-5 h-5 border-2 rounded ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'} flex items-center justify-center transition-all`}>
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span 
            onClick={() => !task.completed && onEdit(task)}
            className={`ml-3 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'} ${!task.completed ? 'cursor-pointer hover:text-indigo-300' : ''} transition-colors`}
            >
            {task.title}
          </span>
        </label>
      </div>

      <div className="flex items-center ml-auto pl-4 space-x-3">
        {isRecurring && <RepeatIcon className="w-4 h-4 text-slate-400" title={`Repeats ${task.recurrence}`} />}
        
        {(formattedDueDate || formattedDueTime) && (
            <div className="flex items-center text-slate-400 text-sm bg-slate-700/50 px-2 py-1 rounded-md">
                <CalendarIcon className="w-4 h-4 mr-1.5" />
                {formattedDueDate && <span>{formattedDueDate}</span>}
                {formattedDueTime && <span className={formattedDueDate ? "ml-1.5" : ""}>{formattedDueTime}</span>}
            </div>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete task"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
