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
import { Clock, RefreshCw, FileText, ArrowDownUp, AlertCircle, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SitemapUpdateCard from '@/components/admin/SitemapUpdateCard';
import SitemapViewer from '@/components/admin/SitemapViewer';

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

interface BlogLink {
  id: string;
  title: string;
  timestamp: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [statsLogs, setStatsLogs] = useState<LogEntry[]>([]);
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [generatorLogs, setGeneratorLogs] = useState<LogEntry[]>([]);
  const [rssFetchCount, setRssFetchCount] = useState<number>(0);
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogLink[]>([]);

  // New function to fetch manually generated blog posts
  const fetchManuallyGeneratedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .select('id, title, created_at')
        .not('title', 'ilike', 'CVE-%')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        const blogLinks: BlogLink[] = data.map(item => ({
          id: item.id,
          title: item.title,
          timestamp: new Date(item.created_at).toLocaleString()
        }));
        setGeneratedBlogs(blogLinks);
        
        updateLogs('generators', [{
          timestamp: new Date().toLocaleTimeString(),
          message: `手動作成されたブログ記事を読み込みました: ${blogLinks.length}`,
          type: 'info'
        }]);
      }
    } catch (err) {
      console.error('Error fetching manual blogs:', err);
    }
  };

  // Update local logs when props change
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
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `強化されたデータ数を読み込みました: ${count || 0}`,
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
        message: `ブログ記事の数を読み込みました: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
    },
  });

  // Query for CVE count
  const { data: cveCount, isLoading: isLoadingCveCount } = useQuery({
    queryKey: ['cveCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .ilike('title', 'CVE-%');
      
      if (error) throw error;
      setRssFetchCount(count || 0);
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

  // Fetch manually generated blogs when generators tab is activated
  useEffect(() => {
    if (activeTab === 'generators') {
      fetchManuallyGeneratedBlogs();
    }
  }, [activeTab]);

  // Add new log entry when pending enrichment count changes
  useEffect(() => {
    if (pendingEnrichmentCount > 0) {
      updateLogs('stats', [{
        timestamp: new Date().toLocaleTimeString(),
        message: `${pendingEnrichmentCount} 件のエントリが強化を待機中`,
        type: 'info'
      }]);
    }
  }, [pendingEnrichmentCount]);

  const handleRssFetchSuccess = (count: number) => {
    setRssFetchCount(prevCount => prevCount + count);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="generators">Generators</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
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
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminActionCard 
              title="Fetch CVE Data" 
              description="Get latest CVE data using RSS"
              functionName="fetch-cve-data"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
              onSuccess={handleRssFetchSuccess}
            />
            
            <AdminActionCard 
              title="Enhance CVE Data" 
              description="Enhance fetched CVE data using AI"
              functionName="enrich-cve-data"
              task="null"
              nextScheduled={enrichTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="Execute Task" 
              description="Run scheduled task"
              functionName="scheduled-tasks"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="Generate Blogs" 
              description="Generate 20 unique blog posts"
              functionName="scheduled-tasks"
              task="generate-blogs"
              nextScheduled={blogGenTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />

            <SitemapUpdateCard
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
          </div>
          
          {/* Processing Logs for Actions tab */}
          <ProcessingLogs 
            title="Processing Logs" 
            description="Action task processing activity"
            logs={actionLogs}
            autoRefresh={true}
            counter={{
              label: "RSS Fetch Counter",
              value: rssFetchCount
            }}
          />
        </TabsContent>
        
        <TabsContent value="generators" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <StatsCard 
              title="Total Blog Posts" 
              value={isLoadingBlogCount ? "Loading..." : `${blogCount}`}
              description="Generated AI blog posts"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="Blog Schedule" 
              value={blogGenTask?.next_run ? "Yes" : "No"}
              description={blogGenTask?.next_run ? `Next generation: ${formatDate(blogGenTask.next_run)}` : "No scheduled blog generation"}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          {/* Manually generated blog posts component */}
          <ProcessingLogs 
            title="Manually Generated Blog Posts" 
            description="Your Japanese blog posts ready to view or share"
            blogLinks={generatedBlogs}
          />
          
          <GenJapaneseBlogFunction />
          
          {/* Processing Logs for Generators tab */}
          <ProcessingLogs 
            title="Processing Logs" 
            description="Generator task processing activity"
            logs={generatorLogs}
            autoRefresh={true}
          />
        </TabsContent>
        
        <TabsContent value="sitemap" className="space-y-4">
          <div className="grid gap-4 grid-cols-1">
            <SitemapViewer />
            <SitemapUpdateCard
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            <ProcessingLogs 
              title="Processing Logs" 
              description="Sitemap operations log"
              logs={actionLogs}
              autoRefresh={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
