
import React, { useState } from 'react';
import ProcessingLogs from '@/components/admin/ProcessingLogs';
import SitemapViewer from '@/components/admin/SitemapViewer';
import SitemapUpdateCard from '@/components/admin/SitemapUpdateCard';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const SitemapTab = () => {
  const [sitemapLogs, setSitemapLogs] = useState<LogEntry[]>([]);

  // Update local logs
  const updateLogs = (newLogs: LogEntry[]) => {
    setSitemapLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Limit to 50 logs
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      <SitemapViewer />
      <SitemapUpdateCard onLogUpdate={(logs) => updateLogs(logs)} />
      <ProcessingLogs 
        title="Processing Logs" 
        description="Sitemap operations log"
        logs={sitemapLogs}
        autoRefresh={true}
      />
    </div>
  );
};

export default SitemapTab;
