
// Types shared across admin components
export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface BlogLink {
  id: string;
  title: string;
  timestamp: string;
}

export interface ScheduledTask {
  id: string;
  task_type: string;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

export interface CounterProps {
  label: string;
  value: number;
}
