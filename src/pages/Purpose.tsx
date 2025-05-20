
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
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
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">CyberSim: Security Assessment Quotation</h1>
        <p className="text-muted-foreground">
          Generate dynamic pricing for cybersecurity services using AI company intelligence and customized assessments.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="company">Company Intelligence</TabsTrigger>
            <TabsTrigger value="services" disabled={!companyProfile}>Service Configuration</TabsTrigger>
            <TabsTrigger value="quote" disabled={!companyProfile || !quoteGenerated}>Quotation</TabsTrigger>
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
    </MainLayout>
  );
};

export default Purpose;
