
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminActionCard from '@/components/admin/AdminActionCard';
import StatsCard from '@/components/admin/StatsCard';
import GenJapaneseBlogFunction from '@/components/admin/GenJapaneseBlogFunction';
import { BookOpenCheck, Database, Bot, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const [stats, setStats] = useState({
    totalVulnerabilities: 0,
    aiEnhanced: 0,
    japaneseBlogs: 0,
    isLoading: true
  });
  
  const [isProcessing, setIsProcessing] = useState({
    fetchingCVEs: false,
    enrichingCVEs: false
  });

  const [logs, setLogs] = useState<string[]>([]);

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total vulnerabilities
      const { count: vulnCount, error: vulnError } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true });

      if (vulnError) throw vulnError;

      // Get AI enhanced count - entries with technical_impact populated
      const { count: enhancedCount, error: enhancedError } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('technical_impact', 'is', null);

      if (enhancedError) throw enhancedError;

      // Get Japanese blogs count - for now, this is just a placeholder
      const { count: blogCount, error: blogError } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .not('severity', 'is', null);

      if (blogError) throw blogError;

      setStats({
        totalVulnerabilities: vulnCount || 0,
        aiEnhanced: enhancedCount || 0,
        japaneseBlogs: blogCount || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "データの取得エラー",
        description: `統計情報を取得できませんでした: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleFetchCVEs = async () => {
    setIsProcessing(prev => ({ ...prev, fetchingCVEs: true }));
    addLog('開始: RSS フィードから CVE データの取得を開始します...');

    try {
      addLog('接続中: CVE フィード (https://cvefeed.io/rssfeed/latest.xml)');
      
      // Call the Supabase Edge Function to fetch CVE data
      const { data, error } = await supabase.functions.invoke('fetch-cve-data');
      
      if (error) throw error;
      
      if (data && data.success) {
        addLog(`取得中: CVE エントリーをダウンロードしています...`);
        addLog(`成功: ${data.count} 件の新しい CVE エントリーを取得しました`);
        addLog('保存中: データベースに生データを保存しています...');
        addLog('完了: すべてのエントリーがデータベースに保存されました');
        
        toast({
          title: "CVE データ取得完了",
          description: `${data.count} 件の新しい CVE エントリーが保存されました`,
        });
        
        // Refresh stats
        fetchStats();
      } else {
        throw new Error(data?.message || "CVE データの取得に失敗しました");
      }
    } catch (error) {
      console.error('Error fetching CVEs:', error);
      addLog(`エラー: CVE データの取得中にエラーが発生しました - ${error.message}`);
      
      toast({
        title: "エラーが発生しました",
        description: `CVE データの取得に失敗しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, fetchingCVEs: false }));
    }
  };

  const handleEnrichCVEs = async () => {
    setIsProcessing(prev => ({ ...prev, enrichingCVEs: true }));
    addLog('開始: AI による CVE データの強化を開始します...');

    try {
      addLog('処理中: 未処理の CVE エントリーを検索しています...');
      
      // Call the Supabase Edge Function to enrich CVE data
      const { data, error } = await supabase.functions.invoke('enrich-cve-data');
      
      if (error) throw error;
      
      if (data && data.success) {
        const processedCount = data.count;
        
        if (processedCount === 0) {
          addLog('情報: 処理が必要なエントリーはありません');
        } else {
          addLog(`見つかりました: ${processedCount} 件の未処理エントリーがあります`);
          
          // Process results
          data.processed.forEach((result: any) => {
            if (result.status === "success") {
              addLog(`成功: "${result.cve_id || result.title}" が強化されました - 技術的分析と影響評価が追加されました`);
            } else {
              addLog(`警告: "${result.cve_id || result.title}" の処理に失敗しました - ${result.error || "不明なエラー"}`);
            }
          });
          
          addLog('完了: AI 強化処理が終了しました');
          
          // Refresh stats
          fetchStats();
        }
        
        toast({
          title: "CVE データ強化完了",
          description: `${processedCount} 件のエントリーが処理されました`,
        });
      } else {
        throw new Error(data?.message || "CVE データの強化に失敗しました");
      }
    } catch (error) {
      console.error('Error enriching CVEs:', error);
      addLog(`エラー: CVE 強化中にエラーが発生しました - ${error.message}`);
      
      toast({
        title: "エラーが発生しました",
        description: `CVE データの強化に失敗しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, enrichingCVEs: false }));
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage vulnerability data and AI-powered content generation
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Vulnerabilities"
            value={stats.isLoading ? "Loading..." : stats.totalVulnerabilities.toString()}
            description="CVE entries in database"
            icon={<Database className="h-5 w-5" />}
          />
          <StatsCard
            title="AI Enhanced"
            value={stats.isLoading ? "Loading..." : stats.aiEnhanced.toString()}
            description="Reports with AI analysis"
            icon={<Bot className="h-5 w-5" />}
          />
          <StatsCard
            title="Japanese Blogs"
            value={stats.isLoading ? "Loading..." : stats.japaneseBlogs.toString()}
            description="AI-generated security blogs"
            icon={<BookOpenCheck className="h-5 w-5" />}
          />
        </div>

        <Tabs defaultValue="vulndb">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="vulndb">Vulnerability Database</TabsTrigger>
            <TabsTrigger value="japblog">Japanese Blog Generator</TabsTrigger>
          </TabsList>
          
          {/* Vulnerability Database Tab */}
          <TabsContent value="vulndb">
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <AdminActionCard
                title="Fetch CVEs from RSS Feed"
                description="Download the latest CVE entries from the official RSS feed"
                buttonText="Fetch Latest CVEs"
                icon={<Database className="h-5 w-5" />}
                onClick={handleFetchCVEs}
                isLoading={isProcessing.fetchingCVEs}
              />
              
              <AdminActionCard
                title="AI Enrich CVE Data"
                description="Process raw CVE data with OpenAI to add technical analysis and business impact"
                buttonText="Start AI Enrichment"
                icon={<Bot className="h-5 w-5" />}
                onClick={handleEnrichCVEs}
                isLoading={isProcessing.enrichingCVEs}
              />
            </div>
            
            {/* Processing Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  生成ログ (Processing Logs)
                </CardTitle>
                <CardDescription>
                  Real-time logs of data processing operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-muted-foreground italic text-sm">No processing logs yet. Start an operation to see logs here.</div>
                ) : (
                  <div className="bg-muted p-3 rounded-md max-h-64 overflow-y-auto font-mono text-xs space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="border-b border-border/20 pb-1 last:border-0 last:pb-0">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Japanese Blog Generator Tab */}
          <TabsContent value="japblog">
            <Card>
              <CardHeader>
                <CardTitle>Japanese Security Blog Generator</CardTitle>
                <CardDescription>
                  Generate comprehensive security blog posts in Japanese using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenJapaneseBlogFunction />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
