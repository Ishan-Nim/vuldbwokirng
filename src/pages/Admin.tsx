
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCard from '@/components/admin/StatsCard';
import AdminActionCard from '@/components/admin/AdminActionCard';
import ProcessingLogs from '@/components/admin/ProcessingLogs';
import JapaneseBlogGenerator from '@/components/admin/JapaneseBlogGenerator';
import GenJapaneseBlogFunction from '@/components/admin/GenJapaneseBlogFunction';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Clock, RefreshCw, FileText, ArrowDownUp, AlertCircle } from 'lucide-react';
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

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [statsLogs, setStatsLogs] = useState<LogEntry[]>([]);
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [generatorLogs, setGeneratorLogs] = useState<LogEntry[]>([]);

  const updateLogs = (tabName: string, newLogs: LogEntry[]) => {
    if (tabName === 'stats') {
      setStatsLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Limit to 50 logs
    } else if (tabName === 'actions') {
      setActionLogs(prev => [...newLogs, ...prev].slice(0, 50));
    } else if (tabName === 'generators') {
      setGeneratorLogs(prev => [...newLogs, ...prev].slice(0, 50));
    }
  };

  // Query for total vulnerability count
  const { data: vulnerabilityCount, isLoading: isLoadingVulnCount } = useQuery({
    queryKey: ['vulnerabilityCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `Loaded vulnerability count: ${count || 0}`,
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
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `Loaded enhanced data count: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
    },
  });

  // Calculate how many vulnerabilities need enrichment
  const pendingEnrichmentCount = (vulnerabilityCount || 0) - (enrichedCount || 0);

  // Query for blog count
  const { data: blogCount, isLoading: isLoadingBlogCount } = useQuery({
    queryKey: ['blogCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('severity', 'is', null)
        .not('title', 'ilike', 'CVE-%');
      
      if (error) throw error;
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `Loaded blog count: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
    },
  });

  // Query for scheduled tasks
  const { data: scheduledTasks, isLoading: isLoadingSchedules } = useQuery<ScheduledTask[]>({
    queryKey: ['scheduledTasks'],
    queryFn: async () => {
      // Use .from('scheduled_tasks') with explicit casting to any to bypass TypeScript issue
      const { data, error } = await (supabase
        .from('scheduled_tasks') as any)
        .select('*');
      
      if (error) throw error;
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `Loaded scheduled tasks: ${data?.length || 0}`,
        type: 'info'
      }]);
      return data || [];
    },
  });

  // Format date helper function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
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
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `${pendingEnrichmentCount} entries waiting for enrichment`,
        type: 'info'
      }]);
    }
  }, [pendingEnrichmentCount]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="generators">Generators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
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
              title="Waiting for Enrichment" 
              value={isLoadingVulnCount || isLoadingEnrichedCount ? "Loading..." : `${pendingEnrichmentCount}`}
              description="Entries waiting to be enriched"
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
              description="Statistics processing activities"
              logs={statsLogs}
              autoRefresh={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminActionCard 
              title="Fetch CVE Data" 
              description="Use RSS function to get the latest CVE data"
              functionName="fetch-cve-data"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="Enhance CVE Data" 
              description="Use AI to enhance the fetched CVE data"
              functionName="enrich-cve-data"
              task="null"
              nextScheduled={enrichTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="Run Task" 
              description="Execute scheduled tasks"
              functionName="scheduled-tasks"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="Generate Blogs" 
              description="Generate 20 unique blog articles"
              functionName="scheduled-tasks"
              task="generate-blogs"
              nextScheduled={blogGenTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
          </div>
          
          {/* Processing Logs for Actions tab */}
          <ProcessingLogs 
            title="Processing Logs" 
            description="Action tasks processing activities"
            logs={actionLogs}
            autoRefresh={true}
          />
        </TabsContent>
        
        <TabsContent value="generators" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <StatsCard 
              title="Total Blog Articles" 
              value={isLoadingBlogCount ? "Loading..." : `${blogCount}`}
              description="Generated AI blog articles"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="Blogs Scheduled" 
              value={blogGenTask?.next_run ? "Yes" : "No"}
              description={blogGenTask?.next_run ? `Next generation at: ${formatDate(blogGenTask.next_run)}` : "No scheduled blog generation"}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <JapaneseBlogGenerator />
          
          {/* Processing Logs for Generators tab */}
          <ProcessingLogs 
            title="Processing Logs" 
            description="Generator tasks processing activities"
            logs={generatorLogs}
            autoRefresh={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
