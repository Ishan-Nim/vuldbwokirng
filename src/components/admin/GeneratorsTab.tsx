
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatsCard from '@/components/admin/StatsCard';
import ProcessingLogs from '@/components/admin/ProcessingLogs';
import GenJapaneseBlogFunction from '@/components/admin/GenJapaneseBlogFunction';
import { Clock, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

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

interface GeneratorsTabProps {
  blogGenTask?: {
    next_run: string | null;
  };
}

const GeneratorsTab = ({ blogGenTask }: GeneratorsTabProps) => {
  const [generatorLogs, setGeneratorLogs] = useState<LogEntry[]>([]);
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogLink[]>([]);

  // Update local logs
  const updateLogs = (newLogs: LogEntry[]) => {
    setGeneratorLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Limit to 50 logs
  };

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
      updateLogs([{
        timestamp: new Date().toLocaleTimeString(),
        message: `ブログ記事の数を読み込みました: ${count || 0}`,
        type: 'info'
      }]);
      return count || 0;
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
        
        updateLogs([{
          timestamp: new Date().toLocaleTimeString(),
          message: `手動作成されたブログ記事を読み込みました: ${blogLinks.length}`,
          type: 'info'
        }]);
      }
    } catch (err) {
      console.error('Error fetching manual blogs:', err);
    }
  };

  // Fetch manually generated blogs when the component mounts
  useEffect(() => {
    fetchManuallyGeneratedBlogs();
  }, []);
  
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default GeneratorsTab;
