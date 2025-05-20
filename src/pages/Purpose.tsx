
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyProfile, ServiceType, ServiceConfig } from '@/types/purpose';
import CompanyIntelligenceTab from '@/components/purpose/CompanyIntelligenceTab';
import ServicesConfigurationTab from '@/components/purpose/ServicesConfigurationTab';
import QuoteSummaryTab from '@/components/purpose/QuoteSummaryTab';

const Purpose = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<ServiceType, boolean>>({
    web: false,
    cloud: false,
    network: false,
    mobile: false
  });
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig>({});
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  
  const moveToServicesTab = () => {
    setActiveTab('services');
  };
  
  const moveToQuoteTab = () => {
    setQuoteGenerated(true);
    setActiveTab('quote');
  };
  
  return (
    <div className="space-y-6 container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">CyberSim: セキュリティ評価見積もり</h1>
      <p className="text-muted-foreground">
        AIによる企業情報と専用評価を利用して、サイバーセキュリティサービスの動的な価格設定を生成します。
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="company">企業情報</TabsTrigger>
          <TabsTrigger value="services" disabled={!companyProfile}>サービス構成</TabsTrigger>
          <TabsTrigger value="quote" disabled={!companyProfile || !quoteGenerated}>見積書</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-4">
          <CompanyIntelligenceTab 
            companyProfile={companyProfile}
            setCompanyProfile={setCompanyProfile}
            moveToNextTab={moveToServicesTab}
          />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <ServicesConfigurationTab 
            serviceConfig={serviceConfig}
            setServiceConfig={setServiceConfig}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            moveToNextTab={moveToQuoteTab}
          />
        </TabsContent>
        
        <TabsContent value="quote" className="space-y-4">
          <QuoteSummaryTab 
            companyProfile={companyProfile}
            serviceConfig={serviceConfig}
            selectedServices={selectedServices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Purpose;
