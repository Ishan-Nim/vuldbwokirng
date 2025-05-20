
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, RefreshCw, ArrowDownUp, Clock } from 'lucide-react';

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
  task
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
      let response;
      
      if (functionName === 'scheduled-tasks') {
        // Call the scheduled-tasks function
        response = await supabase.functions.invoke('scheduled-tasks', {
          body: { task }
        });
      } else {
        // Call the specific function
        response = await supabase.functions.invoke(functionName);
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      console.log(`${functionName} response:`, response.data);
      toast.success(`${title} completed successfully`);
    } catch (error) {
      console.error(`Error in ${functionName}:`, error);
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
