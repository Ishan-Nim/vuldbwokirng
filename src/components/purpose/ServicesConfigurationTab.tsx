
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ServiceType, WebServiceConfig, CloudServiceConfig, NetworkServiceConfig, MobileServiceConfig, ServiceConfig } from '@/types/purpose';
import ServiceCard from './ServiceCard';
import { ServiceFormSelector } from './ServiceFormSelector';

// Create default service schema values
const defaultServiceValues = {
  web: {
    type: "Corporate Website",
    pages: 5,
    loginComplexity: "Basic",
    technologies: [],
    hostingProvider: "",
    cmsIntegration: false,
    seoRequirements: false,
    thirdPartyIntegrations: "",
    apiRequirements: "",
    multilingualSupport: false,
    accessibilityCompliance: "",
    estimatedTraffic: "",
    responsiveDesign: ""
  },
  cloud: {
    type: "Mid-Level Infra",
    accounts: 1,
    providers: [],
    scope: [],
    regions: [],
    compliance: [],
    autoscaling: false,
    cicdRequired: false,
    serverless: false,
    containerization: false,
    disasterRecovery: false,
    monitoring: [],
    costEstimation: ""
  },
  network: {
    type: "Secure External Network",
    mode: "External",
    ipCount: 10,
    vpnRequired: false,
    firewall: false,
    idsIps: false,
    segmentation: false,
    bandwidth: "",
    ipv6Support: false,
    networkDiagram: false,
    dnsServices: "",
    remoteAccess: [],
    thirdPartyConnectivity: ""
  },
  mobile: {
    type: "Mid-Level App",
    count: 1,
    platforms: "Both",
    codeAccess: false,
    developmentType: "",
    appStoreDeployment: false,
    pushNotifications: false,
    backendIntegration: false,
    apiType: "",
    paymentIntegration: false,
    authentication: "",
    offlineFunctionality: false,
    inAppPurchases: false,
    analytics: "",
    securityRequirements: ""
  }
};

const serviceSchema = z.object({
  web: z.object({
    type: z.string().optional(),
    pages: z.number().optional(),
    loginComplexity: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    hostingProvider: z.string().optional(),
    cmsIntegration: z.boolean().optional(),
    cmsType: z.string().optional(),
    seoRequirements: z.boolean().optional(),
    thirdPartyIntegrations: z.string().optional(),
    apiRequirements: z.string().optional(),
    multilingualSupport: z.boolean().optional(),
    accessibilityCompliance: z.string().optional(),
    estimatedTraffic: z.string().optional(),
    responsiveDesign: z.string().optional()
  }).optional(),
  cloud: z.object({
    type: z.string().optional(),
    accounts: z.number().optional(),
    providers: z.array(z.string()).optional(),
    scope: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
    compliance: z.array(z.string()).optional(),
    autoscaling: z.boolean().optional(),
    cicdRequired: z.boolean().optional(),
    cicdTools: z.string().optional(),
    serverless: z.boolean().optional(),
    containerization: z.boolean().optional(),
    disasterRecovery: z.boolean().optional(),
    monitoring: z.array(z.string()).optional(),
    costEstimation: z.string().optional()
  }).optional(),
  network: z.object({
    type: z.string().optional(),
    mode: z.string().optional(),
    ipCount: z.number().optional(),
    vpnRequired: z.boolean().optional(),
    firewall: z.boolean().optional(),
    firewallType: z.string().optional(),
    idsIps: z.boolean().optional(),
    segmentation: z.boolean().optional(),
    bandwidth: z.string().optional(),
    ipv6Support: z.boolean().optional(),
    networkDiagram: z.boolean().optional(),
    dnsServices: z.string().optional(),
    remoteAccess: z.array(z.string()).optional(),
    thirdPartyConnectivity: z.string().optional()
  }).optional(),
  mobile: z.object({
    type: z.string().optional(),
    count: z.number().optional(),
    platforms: z.string().optional(),
    codeAccess: z.boolean().optional(),
    developmentType: z.string().optional(),
    appStoreDeployment: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    backendIntegration: z.boolean().optional(),
    apiType: z.string().optional(),
    paymentIntegration: z.boolean().optional(),
    authentication: z.string().optional(),
    offlineFunctionality: z.boolean().optional(),
    inAppPurchases: z.boolean().optional(),
    analytics: z.string().optional(),
    securityRequirements: z.string().optional()
  }).optional()
});

type ServicesConfigurationTabProps = {
  serviceConfig: ServiceConfig;
  setServiceConfig: (config: ServiceConfig) => void;
  selectedServices: Record<ServiceType, boolean>;
  setSelectedServices: (services: Record<ServiceType, boolean>) => void;
  moveToNextTab: () => void;
};

const ServicesConfigurationTab = ({
  serviceConfig,
  setServiceConfig,
  selectedServices,
  setSelectedServices,
  moveToNextTab,
}: ServicesConfigurationTabProps) => {
  const [activeServiceForm, setActiveServiceForm] = useState<ServiceType | null>(null);
  
  const serviceForm = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultServiceValues
  });
  
  const toggleService = (service: ServiceType) => {
    setSelectedServices({
      ...selectedServices,
      [service]: !selectedServices[service]
    });

    // If service is being enabled, set it as active form and initialize config
    if (!selectedServices[service]) {
      setActiveServiceForm(service);
      
      // Initialize service config with default prices based on service type
      if (!serviceConfig[service]) {
        switch (service) {
          case 'web':
            const webConfig: WebServiceConfig = {
              type: 'Corporate Website',
              pages: 5,
              loginComplexity: 'Basic',
              technologies: [],
              hostingProvider: '',
              cmsIntegration: false,
              seoRequirements: false,
              thirdPartyIntegrations: '',
              apiRequirements: '',
              multilingualSupport: false,
              accessibilityCompliance: '',
              estimatedTraffic: '',
              responsiveDesign: '',
              price: 150,
            };
            setServiceConfig({
              ...serviceConfig,
              web: webConfig
            });
            break;
          case 'cloud':
            const cloudConfig: CloudServiceConfig = {
              type: 'Mid-Level Infra',
              accounts: 1,
              providers: [],
              scope: [],
              regions: [],
              compliance: [],
              autoscaling: false,
              cicdRequired: false,
              cicdTools: '',
              serverless: false,
              containerization: false,
              disasterRecovery: false,
              monitoring: [],
              costEstimation: '',
              price: 300,
            };
            setServiceConfig({
              ...serviceConfig,
              cloud: cloudConfig
            });
            break;
          case 'network':
            const networkConfig: NetworkServiceConfig = {
              type: 'Secure External Network',
              mode: 'External',
              ipCount: 10,
              vpnRequired: false,
              firewall: false,
              firewallType: '',
              idsIps: false,
              segmentation: false,
              bandwidth: '',
              ipv6Support: false,
              networkDiagram: false,
              dnsServices: '',
              remoteAccess: [],
              thirdPartyConnectivity: '',
              price: 250,
            };
            setServiceConfig({
              ...serviceConfig,
              network: networkConfig
            });
            break;
          case 'mobile':
            const mobileConfig: MobileServiceConfig = {
              type: 'Mid-Level App',
              count: 1,
              platforms: 'Both',
              codeAccess: false,
              developmentType: '',
              appStoreDeployment: false,
              pushNotifications: false,
              backendIntegration: false,
              apiType: '',
              paymentIntegration: false,
              authentication: '',
              offlineFunctionality: false,
              inAppPurchases: false,
              analytics: '',
              securityRequirements: '',
              price: 200,
            };
            setServiceConfig({
              ...serviceConfig,
              mobile: mobileConfig
            });
            break;
        }
      }
    } else if (activeServiceForm === service) {
      // If service is being disabled and it's the active form, clear active form
      setActiveServiceForm(null);
    }
  };
  
  const handleServiceConfigChange = (config: WebServiceConfig | CloudServiceConfig | NetworkServiceConfig | MobileServiceConfig) => {
    if (!activeServiceForm) return;
    
    // Use a type guard approach to safely update the specific service config
    switch (activeServiceForm) {
      case 'web':
        setServiceConfig({
          ...serviceConfig,
          web: { ...(config as WebServiceConfig), price: serviceConfig.web?.price || 150 }
        });
        break;
      case 'cloud':
        setServiceConfig({
          ...serviceConfig,
          cloud: { ...(config as CloudServiceConfig), price: serviceConfig.cloud?.price || 300 }
        });
        break;
      case 'network':
        setServiceConfig({
          ...serviceConfig,
          network: { ...(config as NetworkServiceConfig), price: serviceConfig.network?.price || 250 }
        });
        break;
      case 'mobile':
        setServiceConfig({
          ...serviceConfig,
          mobile: { ...(config as MobileServiceConfig), price: serviceConfig.mobile?.price || 200 }
        });
        break;
    }
  };
  
  const handleServiceDetailView = (serviceType: ServiceType) => {
    setActiveServiceForm(serviceType);
  };
  
  const moveToQuotation = () => {
    // Merge form data with service prices
    const formData = serviceForm.getValues();

    // Copy existing service config to keep prices
    const updatedConfig: ServiceConfig = { ...serviceConfig };
    
    // Update with form data for each selected service
    Object.keys(selectedServices).forEach((service) => {
      const serviceKey = service as ServiceType;
      if (selectedServices[serviceKey]) {
        switch(serviceKey) {
          case 'web':
            updatedConfig.web = {
              ...(formData.web || {}),
              ...(updatedConfig.web || {}),
              price: updatedConfig.web?.price || 150,
            } as WebServiceConfig;
            break;
          case 'cloud':
            updatedConfig.cloud = {
              ...(formData.cloud || {}),
              ...(updatedConfig.cloud || {}),
              price: updatedConfig.cloud?.price || 300,
            } as CloudServiceConfig;
            break;
          case 'network':
            updatedConfig.network = {
              ...(formData.network || {}),
              ...(updatedConfig.network || {}),
              price: updatedConfig.network?.price || 250,
            } as NetworkServiceConfig;
            break;
          case 'mobile':
            updatedConfig.mobile = {
              ...(formData.mobile || {}),
              ...(updatedConfig.mobile || {}),
              price: updatedConfig.mobile?.price || 200,
            } as MobileServiceConfig;
            break;
        }
      }
    });
    
    setServiceConfig(updatedConfig);
    moveToNextTab();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Configuration</CardTitle>
        <CardDescription>Select services to include in your quote</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...serviceForm}>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Available Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ServiceCard 
                type="web"
                isSelected={selectedServices.web}
                onClick={() => toggleService('web')}
              />
              
              <ServiceCard 
                type="cloud"
                isSelected={selectedServices.cloud}
                onClick={() => toggleService('cloud')}
              />
              
              <ServiceCard 
                type="network"
                isSelected={selectedServices.network}
                onClick={() => toggleService('network')}
              />
              
              <ServiceCard 
                type="mobile"
                isSelected={selectedServices.mobile}
                onClick={() => toggleService('mobile')}
              />
            </div>

            {/* This is where we'll render the service-specific forms */}
            {activeServiceForm && (
              <ServiceFormSelector 
                selectedService={activeServiceForm} 
                onChange={handleServiceConfigChange} 
              />
            )}
            
            {/* Services Navigation */}
            {Object.values(selectedServices).some(v => v) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(selectedServices).map(([serviceType, isSelected]) => {
                  if (!isSelected) return null;
                  
                  const type = serviceType as ServiceType;
                  const isActive = activeServiceForm === type;
                  
                  return (
                    <Button 
                      key={serviceType}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleServiceDetailView(type)}
                    >
                      {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
                    </Button>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={moveToQuotation}
                disabled={!Object.values(selectedServices).some(v => v)}
              >
                Calculate Quote
              </Button>
            </div>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default ServicesConfigurationTab;
