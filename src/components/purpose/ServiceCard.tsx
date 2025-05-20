
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
        return { jp: 'ウェブセキュリティテスト', en: 'Web Security Testing' };
      case 'cloud':
        return { jp: 'クラウド評価', en: 'Cloud Assessment' };
      case 'network':
        return { jp: 'ネットワークペンテスト', en: 'Network Pentest' };
      case 'mobile':
        return { jp: 'モバイルアプリテスト', en: 'Mobile App Testing' };
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'web':
        return { 
          jp: 'ウェブアプリケーションの脆弱性評価', 
          en: 'Assessment of web applications for vulnerabilities' 
        };
      case 'cloud':
        return { 
          jp: 'クラウドインフラとセキュリティ管理の評価', 
          en: 'Review cloud infrastructure and security controls' 
        };
      case 'network':
        return { 
          jp: '包括的なネットワークセキュリティ評価', 
          en: 'Comprehensive network security assessment' 
        };
      case 'mobile':
        return { 
          jp: 'モバイルアプリケーションのセキュリティ評価', 
          en: 'Security assessment for mobile applications' 
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
            <span>{title.jp}</span>
            <span className="block text-xs text-muted-foreground">{title.en}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description.jp}</p>
        <p className="text-xs text-muted-foreground">{description.en}</p>
        {isSelected && <Check className="h-5 w-5 text-green-500 mt-2" />}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
