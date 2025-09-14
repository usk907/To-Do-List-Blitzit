export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Recurrence {
  NONE = 'None',
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // Format: YYYY-MM-DD
  dueTime?: string; // Format: HH:mm
  recurrence: Recurrence;
}

export type FilterType = 'all' | 'active' | 'completed';
