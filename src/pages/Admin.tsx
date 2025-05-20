
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/admin/StatsCard';
import { AdminActionCard } from '@/components/admin/AdminActionCard';
import { JapaneseBlogGenerator } from '@/components/admin/JapaneseBlogGenerator';
import { GenJapaneseBlogFunction } from '@/components/admin/GenJapaneseBlogFunction';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Clock, RefreshCw, FileText, ArrowDownUp } from 'lucide-react';
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

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const { data: vulnerabilityCount, isLoading: isLoadingVulnCount } = useQuery({
    queryKey: ['vulnerabilityCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: enrichedCount, isLoading: isLoadingEnrichedCount } = useQuery({
    queryKey: ['enrichedCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('severity', 'is', null);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: blogCount, isLoading: isLoadingBlogCount } = useQuery({
    queryKey: ['blogCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('severity', 'is', null)
        .not('title', 'ilike', 'CVE-%');
      
      if (error) throw error;
      return count || 0;
    },
  });

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
              description="データベース内の脆弱性の総数"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="AI強化済み" 
              value={isLoadingEnrichedCount ? "読み込み中..." : `${enrichedCount}`}
              description={`強化率: ${vulnerabilityCount ? Math.round((enrichedCount || 0) / vulnerabilityCount * 100) : 0}%`}
              icon={<ArrowDownUp className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard 
              title="AIブログ" 
              value={isLoadingBlogCount ? "読み込み中..." : `${blogCount}`}
              description="生成されたAIブログ記事の数"
              icon={<RefreshCw className="h-4 w-4 text-muted-foreground" />}
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
                    <h4 className="font-medium">RSS取得スケジュール</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">次回実行:</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {fetchTask ? formatDate(fetchTask.next_run) : "未スケジュール"}
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
                          {enrichTask ? formatDate(enrichTask.next_run) : "未スケジュール"}
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
                          {blogGenTask ? formatDate(blogGenTask.next_run) : "未スケジュール"}
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
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4 grid gap-4 md:grid-cols-2">
          <AdminActionCard 
            title="CVEデータを取得" 
            description="RSS機能を使用して最新のCVEデータを取得します"
            functionName="fetch-cve-data"
            task="fetch-cve"
          />
          
          <AdminActionCard 
            title="CVEデータを強化" 
            description="AIを使用して取得したCVEデータを強化します"
            functionName="enrich-cve-data"
            task="null"
          />
          
          <AdminActionCard 
            title="タスクを実行" 
            description="スケジュールされたタスクを実行します"
            functionName="scheduled-tasks"
            task="fetch-cve"
          />
          
          <AdminActionCard 
            title="ブログを生成" 
            description="20件のユニークなブログ記事を生成します"
            functionName="scheduled-tasks"
            task="generate-blogs"
          />
        </TabsContent>
        
        <TabsContent value="generators" className="space-y-4">
          <JapaneseBlogGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
