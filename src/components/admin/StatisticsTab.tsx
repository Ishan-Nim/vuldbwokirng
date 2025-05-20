
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import StatsCard from '@/components/admin/StatsCard';
import ProcessingLogs from '@/components/admin/ProcessingLogs';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Clock, FileText, ArrowDownUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define type for scheduled tasks
interface ScheduledTask {
  id: string;
  task_type: string;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const StatisticsTab = () => {
  const [statsLogs, setStatsLogs] = useState<LogEntry[]>([]);

  // Update local logs
  const updateLogs = (newLogs: LogEntry[]) => {
    setStatsLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Limit to 50 logs
  };

  // Query for total vulnerability count
  const { data: vulnerabilityCount, isLoading: isLoadingVulnCount } = useQuery({
    queryKey: ['vulnerabilityCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      updateLogs([{
        timestamp: new Date().toLocaleTimeString(),
        message: `脆弱性の総数を読み込みました: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
    },
  });

  // Query for enriched vulnerabilities count
  const { data: enrichedCount, isLoading: isLoadingEnrichedCount } = useQuery({
    queryKey: ['enrichedCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('severity', 'is', null);
      
      if (error) throw error;
      updateLogs([{
        timestamp: new Date().toLocaleTimeString(),
        message: `強化されたデータ数を読み込みました: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
    },
  });

  // Calculate how many vulnerabilities need enrichment
  const pendingEnrichmentCount = (vulnerabilityCount || 0) - (enrichedCount || 0);

  // Query for scheduled tasks
  const { data: scheduledTasks, isLoading: isLoadingSchedules } = useQuery<ScheduledTask[]>({
    queryKey: ['scheduledTasks'],
    queryFn: async () => {
      // Use .from('scheduled_tasks') with explicit casting to any to bypass TypeScript issue
      const { data, error } = await (supabase
        .from('scheduled_tasks') as any)
        .select('*');
      
      if (error) throw error;
      updateLogs([{
        timestamp: new Date().toLocaleTimeString(),
        message: `スケジュールされたタスクを読み込みました: ${data?.length || 0}`,
        type: 'info'
      }]);
      return data || [];
    },
  });

  // Format date helper function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "予定なし";
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return "無効な日付";
    }
  };

  // Find specific task schedules
  const findTaskSchedule = (type: string) => {
    return scheduledTasks?.find(task => task.task_type === type);
  };

  const fetchTask = findTaskSchedule('fetch-cve');
  const enrichTask = findTaskSchedule('enrich-cve');
  const blogGenTask = findTaskSchedule('generate-blogs');

  // Add new log entry when pending enrichment count changes
  useEffect(() => {
    if (pendingEnrichmentCount > 0) {
      updateLogs([{
        timestamp: new Date().toLocaleTimeString(),
        message: `${pendingEnrichmentCount} 件のエントリが強化を待機中`,
        type: 'info'
      }]);
    }
  }, [pendingEnrichmentCount]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Vulnerability Data" 
          value={isLoadingVulnCount ? "Loading..." : `${vulnerabilityCount}`}
          description="Total vulnerabilities in database"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="AI Enhanced" 
          value={isLoadingEnrichedCount ? "Loading..." : `${enrichedCount}`}
          description={`Enhancement rate: ${vulnerabilityCount ? Math.round((enrichedCount || 0) / vulnerabilityCount * 100) : 0}%`}
          icon={<ArrowDownUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Pending Enhancement" 
          value={isLoadingVulnCount || isLoadingEnrichedCount ? "Loading..." : `${pendingEnrichmentCount}`}
          description="Entries waiting for enhancement"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Schedule Information</h3>
          
          {isLoadingSchedules ? (
            <div className="p-4">Loading schedule information...</div>
          ) : (
            <div className="grid gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium">RSS Fetch Schedule</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Next execution:</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {fetchTask ? formatDate(fetchTask.next_run) : "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last execution:</span>
                    <span className="text-sm">{fetchTask ? formatDate(fetchTask.last_run) : "Never executed"}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded">
                <h4 className="font-medium">AI Enhancement Schedule</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Next execution:</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {enrichTask ? formatDate(enrichTask.next_run) : "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last execution:</span>
                    <span className="text-sm">{enrichTask ? formatDate(enrichTask.last_run) : "Never executed"}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Schedule:</span>
                    <span className="text-sm font-medium text-severity-medium">Every 5 hours</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded">
                <h4 className="font-medium">Blog Generation Schedule</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Next execution:</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {blogGenTask ? formatDate(blogGenTask.next_run) : "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last execution:</span>
                    <span className="text-sm">{blogGenTask ? formatDate(blogGenTask.last_run) : "Never executed"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Processing Logs for Statistics tab */}
        <ProcessingLogs 
          title="Processing Logs" 
          description="Statistic processing activity"
          logs={statsLogs}
          autoRefresh={true}
        />
      </div>
    </div>
  );
};

export default StatisticsTab;
