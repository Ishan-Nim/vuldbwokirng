
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface BlogLink {
  id: string;
  title: string;
  timestamp: string;
}

interface ProcessingLogsProps {
  title?: string;
  description?: string;
  logs?: LogEntry[];
  autoRefresh?: boolean;
  counter?: {
    label: string;
    value: number;
  };
  blogLinks?: BlogLink[];
}

const ProcessingLogs: React.FC<ProcessingLogsProps> = ({ 
  title = "Processing Logs", 
  description = "Real-time logs of data processing operations",
  logs = [],
  autoRefresh = false,
  counter,
  blogLinks = []
}) => {
  const [localLogs, setLocalLogs] = useState<LogEntry[]>(logs);
  const [localBlogLinks, setLocalBlogLinks] = useState<BlogLink[]>(blogLinks);
  const navigate = useNavigate();
  
  // Update local logs when props change
  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);
  
  // Update local blog links when props change
  useEffect(() => {
    setLocalBlogLinks(blogLinks);
  }, [blogLinks]);
  
  // Auto refresh effect - adds a dummy update every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // This just triggers a re-render
      setLocalLogs(current => [...current]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);
  
  const getLogBadgeColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-blue-500 text-white';
    }
  };
  
  const clearLogs = () => {
    setLocalLogs([]);
  };

  const handleVisitBlog = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {counter && (
              <div className="flex items-center px-3 py-1 bg-muted rounded-md">
                <span className="text-sm font-medium">{counter.label}:</span>
                <span className="ml-1 text-sm font-bold">{counter.value}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {localBlogLinks.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Generated Blog Posts</h3>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 space-y-2">
              {localBlogLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{link.title}</span>
                    <span className="text-xs text-muted-foreground">{link.timestamp}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleVisitBlog(link.id)}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs">View</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {localLogs.length === 0 && localBlogLinks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-2">No logs available. Execute operations to generate logs.</p>
          </div>
        ) : localLogs.length > 0 ? (
          <div className="bg-muted/50 p-4 rounded-md font-mono text-sm max-h-[300px] overflow-y-auto">
            {localLogs.map((log, index) => (
              <div key={index} className="mb-1 flex">
                <span className="text-muted-foreground mr-2">[{log.timestamp}]</span>
                <Badge 
                  variant="secondary" 
                  className={`${getLogBadgeColor(log.type)} mr-2 h-fit px-1.5 py-0 text-xs`}
                >
                  {log.type.toUpperCase()}
                </Badge>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ProcessingLogs;
