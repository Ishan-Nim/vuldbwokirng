
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClearDatabaseButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ClearDatabaseButton: React.FC<ClearDatabaseButtonProps> = ({
  variant = 'destructive',
  size = 'default',
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleClearDatabase = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      toast.warning("Click the button again to confirm clearing the database");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clear all tables in the correct order to respect foreign key constraints
      await supabase.from('references').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast.info("References table cleared");
      
      await supabase.from('remediations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast.info("Remediations table cleared");
      
      await supabase.from('threat_modeling').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast.info("Threat modeling table cleared");
      
      await supabase.from('vulnerabilities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast.info("Vulnerabilities table cleared");
      
      toast.success("Database successfully cleared");
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error clearing database:', error);
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleClearDatabase}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Clearing...
        </>
      ) : confirmDelete ? (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Confirm Clear Database
        </>
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Database
        </>
      )}
    </Button>
  );
};

export default ClearDatabaseButton;
