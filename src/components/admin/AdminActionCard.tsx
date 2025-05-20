
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  onClick: () => void;
  className?: string;
}

const AdminActionCard: React.FC<AdminActionCardProps> = ({
  title,
  description,
  buttonText,
  icon,
  isLoading = false,
  onClick,
  className
}) => {
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1"></CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminActionCard;
