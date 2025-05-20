
import React, { useState } from 'react';
import AdminActionCard from '@/components/admin/AdminActionCard';
import ProcessingLogs from '@/components/admin/ProcessingLogs';
import SitemapUpdateCard from '@/components/admin/SitemapUpdateCard';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ActionsTabProps {
  fetchTask?: {
    next_run: string | null;
  };
  enrichTask?: {
    next_run: string | null;
  };
  blogGenTask?: {
    next_run: string | null;
  };
}

const ActionsTab = ({ fetchTask, enrichTask, blogGenTask }: ActionsTabProps) => {
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [rssFetchCount, setRssFetchCount] = useState<number>(0);

  // Update local logs
  const updateLogs = (newLogs: LogEntry[]) => {
    setActionLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Limit to 50 logs
  };

  const handleRssFetchSuccess = (count: number) => {
    setRssFetchCount(prevCount => prevCount + count);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminActionCard 
          title="Fetch CVE Data" 
          description="Get latest CVE data using RSS"
          functionName="fetch-cve-data"
          task="fetch-cve"
          nextScheduled={fetchTask?.next_run}
          onLogUpdate={(logs) => updateLogs(logs)}
          onSuccess={handleRssFetchSuccess}
        />
        
        <AdminActionCard 
          title="Enhance CVE Data" 
          description="Enhance fetched CVE data using AI"
          functionName="enrich-cve-data"
          task="null"
          nextScheduled={enrichTask?.next_run}
          onLogUpdate={(logs) => updateLogs(logs)}
        />
        
        <AdminActionCard 
          title="Execute Fetch Task" 
          description="Run scheduled CVE fetch task"
          functionName="scheduled-tasks"
          task="fetch-cve"
          nextScheduled={fetchTask?.next_run}
          onLogUpdate={(logs) => updateLogs(logs)}
        />
        
        <AdminActionCard 
          title="Execute AI Enhancement" 
          description="Run scheduled enhancement task (every 5 hours)"
          functionName="scheduled-tasks"
          task="enrich-cve"
          nextScheduled={enrichTask?.next_run}
          onLogUpdate={(logs) => updateLogs(logs)}
          highlightAction={true}
        />
        
        <AdminActionCard 
          title="Generate Blogs" 
          description="Generate 20 unique blog posts"
          functionName="scheduled-tasks"
          task="generate-blogs"
          nextScheduled={blogGenTask?.next_run}
          onLogUpdate={(logs) => updateLogs(logs)}
        />

        <SitemapUpdateCard
          onLogUpdate={(logs) => updateLogs(logs)}
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
    </div>
  );
};

export default ActionsTab;
