
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw, ExternalLink, Copy, CheckCheck, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLogIndex, setCopiedLogIndex] = useState<number | null>(null);
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
  
  const copyBlogUrl = (blogId: string) => {
    const blogUrl = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard.writeText(blogUrl);
    setCopiedId(blogId);
    toast.success('Blog URL copied to clipboard');
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const copyLog = (logIndex: number) => {
    const logMessage = localLogs[logIndex].message;
    navigator.clipboard.writeText(logMessage);
    setCopiedLogIndex(logIndex);
    toast.success('Log message copied to clipboard');
    
    setTimeout(() => {
      setCopiedLogIndex(null);
    }, 2000);
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
        {/* Manually Generated Blog Posts Section - Always show if there are any */}
        {localBlogLinks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Generated Blog Posts</h3>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 space-y-2 border-2 border-blue-200 dark:border-blue-800">
              {localBlogLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{link.title}</span>
                    <span className="text-xs text-muted-foreground">{link.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyBlogUrl(link.id)}
                      className="flex items-center gap-1 h-8"
                    >
                      {copiedId === link.id ? (
                        <><CheckCheck className="h-3.5 w-3.5" /> Copied</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy</>
                      )}
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleVisitBlog(link.id)}
                      className="flex items-center gap-1 h-8"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </div>
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
              <div key={index} className="mb-1 flex items-center group">
                <span className="text-muted-foreground mr-2">[{log.timestamp}]</span>
                <Badge 
                  variant="secondary" 
                  className={`${getLogBadgeColor(log.type)} mr-2 h-fit px-1.5 py-0 text-xs`}
                >
                  {log.type.toUpperCase()}
                </Badge>
                <span className="flex-grow">{log.message}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyLog(index)}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                >
                  {copiedLogIndex === index ? (
                    <CheckCheck className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        
        {localBlogLinks.length > 0 && localLogs.length > 0 && (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300">
              Japanese blog post successfully generated
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingLogs;
