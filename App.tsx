import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Task, Priority, FilterType, Recurrence } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import FilterTabs from './components/FilterTabs';
import ReminderPopup from './components/ReminderPopup';
import EditTaskModal from './components/EditTaskModal';
import { generateSubTasks } from './services/geminiService';

/**
 * Creates a Date object from a task's dueDate and/or dueTime.
 * - Handles tasks with both a date and time.
 * - Handles tasks with only a date (defaults to midnight).
 * - Handles tasks with only a time (defaults to the current day).
 * @param task The task object.
 * @returns A Date object if the task is scheduled, otherwise null.
 */
const getTaskDueDateTime = (task: Task): Date | null => {
  const { dueDate, dueTime } = task;
  if (!dueDate && !dueTime) {
    return null;
  }

  const datePart = dueDate || new Date().toISOString().split('T')[0];
  const timePart = dueTime || '00:00:00';
  
  return new Date(`${datePart}T${timePart}`);
};


const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = useCallback((title: string, priority: Priority, dueDate: string | undefined, dueTime: string | undefined, recurrence: Recurrence) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      dueDate,
      dueTime,
      recurrence,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  const generateAndAddTasks = useCallback(async (goal: string) => {
    setError(null);
    try {
      const generated = await generateSubTasks(goal);
      const newTasks: Task[] = generated.map(task => ({
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        recurrence: Recurrence.NONE,
      }));
      setTasks(prev => [...prev, ...newTasks]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while generating tasks.");
      }
    }
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks(currentTasks => {
        const taskToToggle = currentTasks.find(t => t.id === id);
        if (!taskToToggle) return currentTasks;

        if (taskToToggle.recurrence === Recurrence.NONE) {
            return currentTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        }

        const now = new Date();
        const currentDueDate = getTaskDueDateTime(taskToToggle) || now;
        
        let nextDueDateObj = new Date(currentDueDate);

        switch (taskToToggle.recurrence) {
            case Recurrence.HOURLY: nextDueDateObj.setHours(nextDueDateObj.getHours() + 1); break;
            case Recurrence.DAILY: nextDueDateObj.setDate(nextDueDateObj.getDate() + 1); break;
            case Recurrence.WEEKLY: nextDueDateObj.setDate(nextDueDateObj.getDate() + 7); break;
        }

        if (nextDueDateObj < now) {
            nextDueDateObj = now;
             switch (taskToToggle.recurrence) {
                case Recurrence.HOURLY: nextDueDateObj.setHours(nextDueDateObj.getHours() + 1); break;
                case Recurrence.DAILY: nextDueDateObj.setDate(nextDueDateObj.getDate() + 1); break;
                case Recurrence.WEEKLY: nextDueDateObj.setDate(nextDueDateObj.getDate() + 7); break;
            }
        }
        
        const nextDueDate = nextDueDateObj.toISOString().split('T')[0];
        const nextDueTime = nextDueDateObj.toTimeString().substring(0, 5);

        return currentTasks.map(t =>
            t.id === id ? { ...t, dueDate: nextDueDate, dueTime: nextDueTime, completed: false } : t
        );
    });
}, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  }, [setTasks]);

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(currentTasks =>
      currentTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };
  
  const handleMarkDoneFromPopup = (id: string) => {
    toggleTask(id);
    setReminders(reminders => reminders.filter(r => r.id !== id));
  };


  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const dueTasks = tasks.filter(task => {
            if (task.completed) return false;
            
            const dueDateTime = getTaskDueDateTime(task);
            if (!dueDateTime) return false;

            const isDue = dueDateTime <= now;
            const isAlreadyRinging = reminders.some(r => r.id === task.id);

            return isDue && !isAlreadyRinging;
        });

        if (dueTasks.length > 0) {
            setReminders(prev => [...prev, ...dueTasks]);
        }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [tasks, reminders]);


  const filteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        const aDueTime = getTaskDueDateTime(a)?.getTime() ?? Infinity;
        const bDueTime = getTaskDueDateTime(b)?.getTime() ?? Infinity;
        
        // For completed tasks, sort by newest first
        if (a.completed) {
          if (aDueTime === Infinity) return 1;
          if (bDueTime === Infinity) return -1;
          return bDueTime - aDueTime;
        }
        
        // For active tasks, sort by oldest (most urgent) first
        return aDueTime - bDueTime;
    });

    switch (filter) {
      case 'active':
        return sortedTasks.filter(task => !task.completed);
      case 'completed':
        return sortedTasks.filter(task => task.completed);
      case 'all':
      default:
        return sortedTasks;
    }
  }, [tasks, filter]);
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-white">My Tasks</h1>
              <p className="text-slate-400">{today}</p>
            </header>

            <TaskInput onAddTask={addTask} onGenerateTasks={generateAndAddTasks} />

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="mb-4">
              <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-2">
              <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleOpenEditModal} />
            </div>
          </div>
        </div>
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseEditModal}
        />
      )}
      {reminders.map(task => (
        <ReminderPopup 
          key={task.id}
          task={task}
          onClose={() => setReminders(reminders => reminders.filter(r => r.id !== task.id))}
          onMarkDone={handleMarkDoneFromPopup}
        />
      ))}
    </>
  );
};

export default App;
