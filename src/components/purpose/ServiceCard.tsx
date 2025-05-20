
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
        return { en: 'Web Security Testing', jp: 'ウェブセキュリティテスト' };
      case 'cloud':
        return { en: 'Cloud Assessment', jp: 'クラウド評価' };
      case 'network':
        return { en: 'Network Pentest', jp: 'ネットワークペンテスト' };
      case 'mobile':
        return { en: 'Mobile App Testing', jp: 'モバイルアプリテスト' };
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'web':
        return { 
          en: 'Assessment of web applications for vulnerabilities', 
          jp: 'ウェブアプリケーションの脆弱性評価'
        };
      case 'cloud':
        return { 
          en: 'Review cloud infrastructure and security controls', 
          jp: 'クラウドインフラとセキュリティ管理の評価'
        };
      case 'network':
        return { 
          en: 'Comprehensive network security assessment', 
          jp: '包括的なネットワークセキュリティ評価'
        };
      case 'mobile':
        return { 
          en: 'Security assessment for mobile applications', 
          jp: 'モバイルアプリケーションのセキュリティ評価'
        };
    }
  };

  const title = getTitle();
  const description = getDescription();

  return (
    <Card 
      className={`shadow-sm border-2 ${isSelected ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getIcon()}
          <div>
            <span>{title.en}</span>
            <span className="block text-xs text-muted-foreground">{title.jp}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description.en}</p>
        <p className="text-xs text-muted-foreground">{description.jp}</p>
        {isSelected && <Check className="h-5 w-5 text-green-500 mt-2" />}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
