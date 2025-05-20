
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ProcessingLogsProps {
  title?: string;
  description?: string;
  logs?: LogEntry[];
  autoRefresh?: boolean;
}

const ProcessingLogs: React.FC<ProcessingLogsProps> = ({ 
  title = "Processing Logs", 
  description = "Real-time logs of data processing operations",
  logs = [],
  autoRefresh = false
}) => {
  const [localLogs, setLocalLogs] = useState<LogEntry[]>(logs);
  
  // Update local logs when props change
  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);
  
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
          <Button variant="outline" size="sm" onClick={clearLogs}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {localLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-2">No logs available. Run an operation to generate logs.</p>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingLogs;
