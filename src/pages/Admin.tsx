
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
import ClearDatabaseCard from '@/components/admin/ClearDatabaseCard';

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
  const [rssFetchCount, setRssFetchCount] = useState<number>(0);

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
      <h1 className="text-3xl font-bold mb-6">管理ダッシュボード</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">統計</TabsTrigger>
          <TabsTrigger value="actions">アクション</TabsTrigger>
          <TabsTrigger value="generators">ジェネレーター</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard 
              title="脆弱性データ" 
              value={isLoadingVulnCount ? "読み込み中..." : `${vulnerabilityCount}`}
              description="データベース内の総脆弱性数"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="AI強化済み" 
              value={isLoadingEnrichedCount ? "読み込み中..." : `${enrichedCount}`}
              description={`強化率: ${vulnerabilityCount ? Math.round((enrichedCount || 0) / vulnerabilityCount * 100) : 0}%`}
              icon={<ArrowDownUp className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="強化待ち" 
              value={isLoadingVulnCount || isLoadingEnrichedCount ? "読み込み中..." : `${pendingEnrichmentCount}`}
              description="強化待ちのエントリ"
              icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">スケジュール情報</h3>
              
              {isLoadingSchedules ? (
                <div className="p-4">スケジュール情報を読み込み中...</div>
              ) : (
                <div className="grid gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">RSSフェッチスケジュール</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">次回実行:</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {fetchTask ? formatDate(fetchTask.next_run) : "予定なし"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">前回実行:</span>
                        <span className="text-sm">{fetchTask ? formatDate(fetchTask.last_run) : "未実行"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">AI強化スケジュール</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">次回実行:</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {enrichTask ? formatDate(enrichTask.next_run) : "予定なし"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">前回実行:</span>
                        <span className="text-sm">{enrichTask ? formatDate(enrichTask.last_run) : "未実行"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">ブログ生成スケジュール</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">次回実行:</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {blogGenTask ? formatDate(blogGenTask.next_run) : "予定なし"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">前回実行:</span>
                        <span className="text-sm">{blogGenTask ? formatDate(blogGenTask.last_run) : "未実行"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Processing Logs for Statistics tab */}
            <ProcessingLogs 
              title="処理ログ" 
              description="統計処理アクティビティ"
              logs={statsLogs}
              autoRefresh={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminActionCard 
              title="CVEデータフェッチ" 
              description="RSSを使用して最新のCVEデータを取得"
              functionName="fetch-cve-data"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
              onSuccess={handleRssFetchSuccess}
            />
            
            <AdminActionCard 
              title="CVEデータ強化" 
              description="AIを使用してフェッチしたCVEデータを強化"
              functionName="enrich-cve-data"
              task="null"
              nextScheduled={enrichTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="タスク実行" 
              description="スケジュールされたタスクを実行"
              functionName="scheduled-tasks"
              task="fetch-cve"
              nextScheduled={fetchTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
            
            <AdminActionCard 
              title="ブログ生成" 
              description="20個のユニークなブログ記事を生成"
              functionName="scheduled-tasks"
              task="generate-blogs"
              nextScheduled={blogGenTask?.next_run}
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />

            <ClearDatabaseCard 
              onLogUpdate={(logs) => updateLogs('actions', logs)}
            />
          </div>
          
          {/* Processing Logs for Actions tab */}
          <ProcessingLogs 
            title="処理ログ" 
            description="アクションタスク処理アクティビティ"
            logs={actionLogs}
            autoRefresh={true}
            counter={{
              label: "RSSフェッチカウンター",
              value: rssFetchCount
            }}
          />
        </TabsContent>
        
        <TabsContent value="generators" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <StatsCard 
              title="ブログ記事の総数" 
              value={isLoadingBlogCount ? "読み込み中..." : `${blogCount}`}
              description="生成されたAIブログ記事"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="ブログスケジュール" 
              value={blogGenTask?.next_run ? "はい" : "いいえ"}
              description={blogGenTask?.next_run ? `次回生成: ${formatDate(blogGenTask.next_run)}` : "スケジュールされたブログ生成はありません"}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <JapaneseBlogGenerator />
          
          {/* Processing Logs for Generators tab */}
          <ProcessingLogs 
            title="処理ログ" 
            description="ジェネレータータスク処理アクティビティ"
            logs={generatorLogs}
            autoRefresh={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
