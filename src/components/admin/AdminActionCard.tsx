
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Clock, Play, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AdminActionCardProps {
  title: string;
  description: string;
  functionName: string;
  task?: string;
  nextScheduled?: string | null;
  onLogUpdate?: (logs: LogEntry[]) => void;
  onSuccess?: (count?: number) => void;
  highlightAction?: boolean;
}

const AdminActionCard = ({
  title, 
  description, 
  functionName, 
  task = null,
  nextScheduled,
  onLogUpdate,
  onSuccess,
  highlightAction = false
}: AdminActionCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const handleAction = async () => {
    setIsLoading(true);
    
    try {
      const requestBody = task ? { task } : {};
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });
      
      if (error) throw error;
      
      // Log the successful action
      if (onLogUpdate) {
        onLogUpdate([{
          timestamp: new Date().toLocaleTimeString(),
          message: `成功: ${title} - ${JSON.stringify(data?.message || 'アクションが完了しました')}`,
          type: 'success'
        }]);
      }
      
      // Additional processing for fetch functions
      if (functionName === 'fetch-cve-data' && data?.count && onSuccess) {
        onSuccess(data.count);
      }
      
      // Additional handling for scheduled tasks
      if (functionName === 'scheduled-tasks' && onSuccess && data?.count) {
        onSuccess(data.count);
      }
      
      toast({
        title: "操作成功",
        description: data?.message || `${title}が正常に処理されました`,
        variant: "default",
      });
    } catch (err: any) {
      console.error(`Error executing ${functionName}:`, err);
      
      if (onLogUpdate) {
        onLogUpdate([{
          timestamp: new Date().toLocaleTimeString(),
          message: `エラー: ${title} - ${err.message || 'アクションの実行に失敗しました'}`,
          type: 'error'
        }]);
      }
      
      toast({
        title: "エラーが発生しました",
        description: err.message || `${title}の処理中にエラーが発生しました`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn(
      "flex flex-col relative", 
      highlightAction && "border-severity-medium dark:border-severity-medium shadow-md"
    )}>
      {highlightAction && (
        <div className="absolute -top-3 -right-2">
          <span className="bg-severity-medium text-white text-xs px-2 py-1 rounded-full">New Schedule</span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {nextScheduled && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Next scheduled: {formatDate(nextScheduled)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAction} 
          disabled={isLoading}
          className={cn(
            "w-full", 
            highlightAction ? "bg-severity-medium hover:bg-severity-medium/90" : ""
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Execute Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminActionCard;
