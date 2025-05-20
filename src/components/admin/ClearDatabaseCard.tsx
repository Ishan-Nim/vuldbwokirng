
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClearDatabaseCardProps {
  title?: string;
  description?: string;
  onLogUpdate?: (logs: Array<{timestamp: string, message: string, type: 'info' | 'success' | 'warning' | 'error'}>) => void;
}

const ClearDatabaseCard: React.FC<ClearDatabaseCardProps> = ({
  title = "Clear Database",
  description = "Remove all data from the database",
  onLogUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (onLogUpdate) {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      onLogUpdate([{timestamp, message, type}]);
    }
  };
  
  const handleClearDatabase = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      addLog("Click the button again to confirm database clearing.", "warning");
      return;
    }
    
    setIsLoading(true);
    addLog("Starting database clearing process...", "info");
    
    try {
      // Clear all tables in the correct order to respect foreign key constraints
      await supabase.from('references').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      addLog("References table cleared", "info");
      
      await supabase.from('remediations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      addLog("Remediations table cleared", "info");
      
      await supabase.from('threat_modeling').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      addLog("Threat modeling table cleared", "info");
      
      await supabase.from('vulnerabilities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      addLog("Vulnerabilities table cleared", "info");
      
      toast.success("Database successfully cleared");
      addLog("Database successfully cleared", "success");
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error clearing database:', error);
      addLog(`Error: ${error.message || 'Unknown error occurred'}`, "error");
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("h-full flex flex-col bg-orange-50 border-orange-200")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Trash2 className="h-5 w-5" />
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="p-4 bg-orange-100 rounded-md text-orange-700 text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>
              Warning: This operation cannot be undone. All data will be permanently deleted from the database.
              Use only when starting a new development environment or test.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive"
          className="w-full" 
          onClick={handleClearDatabase}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : confirmDelete ? (
            'Confirm: Clear Database'
          ) : (
            'Clear Database'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClearDatabaseCard;
