
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">サイバーシム: セキュリティ評価見積もり</h1>
        <p className="text-muted-foreground">
          AIによる企業情報と専用評価を利用して、カスタマイズされたサイバーセキュリティサービスの価格設定を生成します。
        </p>
      </div>
      
      <div className="bg-card dark:bg-card border rounded-lg shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="h-14 w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="company" 
                className="h-14 flex-1 data-[state=active]:bg-background rounded-none border-r"
              >
                企業情報
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="h-14 flex-1 data-[state=active]:bg-background rounded-none border-r"
                disabled={!companyProfile}
              >
                サービス構成
              </TabsTrigger>
              <TabsTrigger 
                value="quote" 
                className="h-14 flex-1 data-[state=active]:bg-background rounded-none"
                disabled={!companyProfile || !quoteGenerated}
              >
                見積書
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="company" className="mt-0">
              <CompanyIntelligenceTab 
                companyProfile={companyProfile}
                setCompanyProfile={setCompanyProfile}
                moveToNextTab={moveToServicesTab}
              />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <ServicesConfigurationTab 
                serviceConfig={serviceConfig}
                setServiceConfig={setServiceConfig}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                moveToNextTab={moveToQuoteTab}
              />
            </TabsContent>
            
            <TabsContent value="quote" className="mt-0">
              <QuoteSummaryTab 
                companyProfile={companyProfile}
                serviceConfig={serviceConfig}
                selectedServices={selectedServices}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Purpose;
