
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define type for scheduled tasks
export interface ScheduledTask {
  id: string;
  task_type: string;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

export const useScheduledTasks = () => {
  // Query for scheduled tasks
  const { data: scheduledTasks, isLoading: isLoadingSchedules } = useQuery<ScheduledTask[]>({
    queryKey: ['scheduledTasks'],
    queryFn: async () => {
      // Use .from('scheduled_tasks') with explicit casting to any to bypass TypeScript issue
      const { data, error } = await (supabase
        .from('scheduled_tasks') as any)
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Find specific task schedules
  const findTaskSchedule = (type: string) => {
    return scheduledTasks?.find(task => task.task_type === type);
  };

  const fetchTask = findTaskSchedule('fetch-cve');
  const enrichTask = findTaskSchedule('enrich-cve');
  const blogGenTask = findTaskSchedule('generate-blogs');

  return {
    scheduledTasks,
    isLoadingSchedules,
    fetchTask,
    enrichTask,
    blogGenTask
  };
};
