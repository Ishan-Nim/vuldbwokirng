
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Check, Calculator, Database, Network, Smartphone } from 'lucide-react';
import { ServiceType } from '@/types/purpose';

type ServiceCardProps = {
  type: ServiceType;
  isSelected: boolean;
  onClick: () => void;
};

const ServiceCard = ({ type, isSelected, onClick }: ServiceCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'web':
        return <Calculator className="h-5 w-5 mr-2" />;
      case 'cloud':
        return <Database className="h-5 w-5 mr-2" />;
      case 'network':
        return <Network className="h-5 w-5 mr-2" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5 mr-2" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'web':
        return 'Web Security Testing';
      case 'cloud':
        return 'Cloud Assessment';
      case 'network':
        return 'Network Pentest';
      case 'mobile':
        return 'Mobile App Testing';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'web':
        return 'Assessment of web applications for vulnerabilities';
      case 'cloud':
        return 'Review cloud infrastructure and security controls';
      case 'network':
        return 'Comprehensive network security assessment';
      case 'mobile':
        return 'Security assessment for mobile applications';
    }
  };

  return (
    <Card 
      className={`shadow-sm border-2 ${isSelected ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{getDescription()}</p>
        {isSelected && <Check className="h-5 w-5 text-green-500 mt-2" />}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
