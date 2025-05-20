
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, RefreshCw, ArrowDownUp } from 'lucide-react';
import { format } from 'date-fns';

interface AdminActionCardProps {
  title: string;
  description: string;
  buttonText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  functionName?: string;
  task?: string;
  nextScheduled?: string | null;
  onLogUpdate?: (logs: Array<{timestamp: string, message: string, type: 'info' | 'success' | 'warning' | 'error'}>) => void;
}

const AdminActionCard: React.FC<AdminActionCardProps> = ({
  title,
  description,
  buttonText,
  icon,
  isLoading: externalIsLoading,
  onClick: externalOnClick,
  className,
  functionName,
  task,
  nextScheduled,
  onLogUpdate
}) => {
  const [isLoading, setIsLoading] = useState(externalIsLoading || false);
  
  const getIcon = () => {
    if (icon) return icon;
    
    // Default icons based on function type
    if (functionName === 'fetch-cve-data') return <RefreshCw className="h-5 w-5" />;
    if (functionName === 'enrich-cve-data') return <ArrowDownUp className="h-5 w-5" />;
    if (functionName === 'scheduled-tasks') return <Clock className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };
  
  const getButtonText = () => {
    if (buttonText) return buttonText;
    
    if (functionName === 'fetch-cve-data') return 'Run RSS Fetch';
    if (functionName === 'enrich-cve-data') return 'Start Enrichment';
    if (functionName === 'scheduled-tasks' && task === 'fetch-cve') return 'Run Task';
    if (functionName === 'scheduled-tasks' && task === 'generate-blogs') return 'Generate Blogs';
    return 'Execute';
  };
  
  const formatScheduledTime = (timeString: string | null) => {
    if (!timeString) return "Not scheduled";
    try {
      return format(new Date(timeString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return "Invalid date";
    }
  };

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (onLogUpdate) {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      onLogUpdate([{timestamp, message, type}]);
    }
  };
  
  const handleClick = async () => {
    if (externalOnClick) {
      externalOnClick();
      return;
    }
    
    if (!functionName) {
      console.error('No function name provided');
      return;
    }
    
    setIsLoading(true);
    
    try {
      addLog(`Starting: ${title} operation...`);
      
      let response;
      
      if (functionName === 'fetch-cve-data') {
        addLog("Starting RSS feed data fetch...");
        response = await supabase.functions.invoke('fetch-cve-data');
      } else if (functionName === 'enrich-cve-data') {
        addLog("Starting data enrichment process...");
        response = await supabase.functions.invoke('enrich-cve-data');
      } else if (functionName === 'scheduled-tasks') {
        // Call the scheduled-tasks function
        addLog(`Running scheduled task: ${task}`);
        response = await supabase.functions.invoke('scheduled-tasks', {
          body: { task }
        });
        
        if (task === 'generate-blogs' && response.data?.topics) {
          addLog(`Generated blog topics: ${response.data.topics.length}`, 'success');
          response.data.topics.forEach((topic: string, index: number) => {
            if (index < 5) {
              addLog(`Topic ${index + 1}: ${topic}`);
            }
          });
          if (response.data.topics.length > 5) {
            addLog(`... and ${response.data.topics.length - 5} more topics`);
          }
        }
      } else {
        // Call the specific function
        addLog(`Executing function: ${functionName}`);
        response = await supabase.functions.invoke(functionName);
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      console.log(`${functionName} response:`, response.data);
      addLog(`${title} completed successfully`, 'success');
      toast.success(`${title} completed successfully`);
    } catch (error) {
      console.error(`Error in ${functionName}:`, error);
      addLog(`Error: ${error.message || 'Unknown error occurred'}`, 'error');
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {getIcon()}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
        {nextScheduled && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Next scheduled: {formatScheduledTime(nextScheduled)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1"></CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminActionCard;
