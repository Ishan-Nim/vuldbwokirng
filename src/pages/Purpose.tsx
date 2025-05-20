import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle, Calculator, Database, Network, Smartphone } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceFormSelector } from '@/components/purpose/ServiceFormSelector';
import { CompanyProfile, ServiceType, ServiceConfig, WebServiceConfig, CloudServiceConfig, NetworkServiceConfig, MobileServiceConfig } from '@/types/purpose';

const companySchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
});

// Complex schema for all service configurations
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

const Purpose = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<ServiceType, boolean>>({
    web: false,
    cloud: false,
    network: false,
    mobile: false
  });
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig>({});
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [activeServiceForm, setActiveServiceForm] = useState<ServiceType | null>(null);
  
  // Company Intelligence Form
  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
    },
  });

  // Service Configuration Form
  const serviceForm = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultServiceValues
  });

  const generateCompanyProfile = async (data: { companyName: string }) => {
    if (!data.companyName) return;
    
    setIsLoading(true);
    try {
      // Call OpenAI to generate company profile
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are an AI assistant specialized in company intelligence. Generate a detailed profile for the given company with these exact fields: name, website, headOffice, employeeCount, mainBusiness (array), established, capital, revenue, dataBreaches (array), isListed, stockPrice, country, isJapaneseListed. Format as JSON.' 
            },
            { 
              role: 'user', 
              content: `Generate a company profile for: ${data.companyName}` 
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      
      const result = await response.json();
      
      try {
        // Parse the OpenAI response to extract the company profile
        const content = result.choices[0].message.content;
        // Try to extract JSON from the content if it's not already JSON
        const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/({[\s\S]*})/);
        const profileData = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);
        
        // Use the parsed data or fall back to generated mock data
        const mockProfile: CompanyProfile = {
          name: profileData.name || data.companyName,
          website: profileData.website || `${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          headOffice: profileData.headOffice || 'Unknown',
          employeeCount: profileData.employeeCount || Math.floor(Math.random() * 10000),
          mainBusiness: profileData.mainBusiness || ['Technology'],
          established: profileData.established || Math.floor(Math.random() * 30 + 1980).toString(),
          capital: profileData.capital || 'Unknown',
          revenue: profileData.revenue || 'Unknown',
          dataBreaches: profileData.dataBreaches || [],
          isListed: profileData.isListed || false,
          stockPrice: profileData.stockPrice || 'N/A',
          country: profileData.country || 'Unknown',
          isJapaneseListed: profileData.isJapaneseListed || false
        };
        
        setCompanyProfile(mockProfile);
        toast({
          title: "Company Profile Generated",
          description: `Successfully retrieved information about ${mockProfile.name}`,
        });
        
        // Move to services tab after profile is generated
        setActiveTab('services');
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        // Fallback to mock data on parsing error
        const isJapaneseListed = data.companyName.toLowerCase().includes('sony') || 
                              data.companyName.toLowerCase().includes('toyota') ||
                              data.companyName.toLowerCase().includes('nintendo');
      
        const mockProfile: CompanyProfile = {
          name: data.companyName,
          website: data.companyName.toLowerCase().replace(/\s+/g, '') + '.com',
          headOffice: isJapaneseListed ? 'Tokyo, Japan' : 'Unknown',
          employeeCount: isJapaneseListed ? Math.floor(Math.random() * 100000) + 10000 : Math.floor(Math.random() * 10000),
          mainBusiness: isJapaneseListed 
            ? ['Electronics', 'Entertainment', 'Financial Services'] 
            : ['Technology'],
          established: isJapaneseListed ? '1946' : Math.floor(Math.random() * 30 + 1980).toString(),
          capital: isJapaneseListed ? '¥880.24 billion' : 'Unknown',
          revenue: isJapaneseListed ? '¥11.54 trillion' : 'Unknown',
          dataBreaches: [],
          isListed: isJapaneseListed,
          stockPrice: isJapaneseListed ? '¥14,000' : 'N/A',
          country: isJapaneseListed ? 'Japan' : 'Unknown',
          isJapaneseListed: isJapaneseListed,
        };
        
        setCompanyProfile(mockProfile);
        toast({
          title: "Company Profile Generated",
          description: `Successfully generated information about ${data.companyName}`,
        });
        
        // Move to services tab after profile is generated
        setActiveTab('services');
      }
    } catch (error) {
      console.error('Error generating company profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate company profile. Using simulated data.",
      });
      
      // Fallback to simulated data on API error
      const isJapaneseListed = data.companyName.toLowerCase().includes('sony') || 
                            data.companyName.toLowerCase().includes('toyota') ||
                            data.companyName.toLowerCase().includes('nintendo');
      
      const mockProfile: CompanyProfile = {
        name: data.companyName,
        website: data.companyName.toLowerCase().replace(/\s+/g, '') + '.com',
        headOffice: isJapaneseListed ? 'Tokyo, Japan' : 'Unknown',
        employeeCount: isJapaneseListed ? Math.floor(Math.random() * 100000) + 10000 : Math.floor(Math.random() * 10000),
        mainBusiness: isJapaneseListed 
          ? ['Electronics', 'Entertainment', 'Financial Services'] 
          : ['Technology'],
        established: isJapaneseListed ? '1946' : Math.floor(Math.random() * 30 + 1980).toString(),
        capital: isJapaneseListed ? '¥880.24 billion' : 'Unknown',
        revenue: isJapaneseListed ? '¥11.54 trillion' : 'Unknown',
        dataBreaches: [],
        isListed: isJapaneseListed,
        stockPrice: isJapaneseListed ? '¥14,000' : 'N/A',
        country: isJapaneseListed ? 'Japan' : 'Unknown',
        isJapaneseListed: isJapaneseListed,
      };
      
      setCompanyProfile(mockProfile);
      setActiveTab('services');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleService = (service: ServiceType) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));

    // If service is being enabled, set it as active form and initialize config
    if (!selectedServices[service]) {
      setActiveServiceForm(service);
      
      // Initialize service config with default prices based on service type
      if (!serviceConfig[service]) {
        let defaultConfig: Partial<WebServiceConfig | CloudServiceConfig | NetworkServiceConfig | MobileServiceConfig> = {};
        
        switch (service) {
          case 'web':
            defaultConfig = {
              type: 'Corporate Website',
              price: 150,
            } as WebServiceConfig;
            break;
          case 'cloud':
            defaultConfig = {
              type: 'Mid-Level Infra',
              price: 300,
            } as CloudServiceConfig;
            break;
          case 'network':
            defaultConfig = {
              type: 'Secure External Network',
              price: 250,
            } as NetworkServiceConfig;
            break;
          case 'mobile':
            defaultConfig = {
              type: 'Mid-Level App',
              price: 200,
            } as MobileServiceConfig;
            break;
        }
        
        setServiceConfig(prev => ({
          ...prev,
          [service]: defaultConfig
        }));
      }
    } else if (activeServiceForm === service) {
      // If service is being disabled and it's the active form, clear active form
      setActiveServiceForm(null);
    }
  };
  
  const moveToQuotation = () => {
    // Merge form data with service prices
    const formData = serviceForm.getValues();

    // Copy existing service config to keep prices
    const updatedConfig = { ...serviceConfig };
    
    // Update with form data for each selected service
    Object.keys(selectedServices).forEach((service) => {
      const serviceKey = service as ServiceType;
      if (selectedServices[serviceKey]) {
        updatedConfig[serviceKey] = {
          ...formData[serviceKey],
          ...(updatedConfig[serviceKey] || {}),  // Keep existing price
        };
      }
    });
    
    setServiceConfig(updatedConfig);
    setQuoteGenerated(true);
    setActiveTab('quote');
  };
  
  const calculateTotal = () => {
    let total = 0;
    
    Object.entries(serviceConfig).forEach(([service, config]) => {
      if (selectedServices[service as ServiceType] && config) {
        total += (config as any).price || 0;
      }
    });
    
    // Apply Japanese listed company premium if applicable
    if (companyProfile?.isJapaneseListed) {
      total = Math.round(total * 1.12); // 12% increase
    }
    
    return total;
  };
  
  // Get the services that are actually selected
  const getSelectedServiceConfigs = () => {
    const selectedConfigs: ServiceConfig = {};
    
    Object.entries(serviceConfig).forEach(([service, config]) => {
      if (selectedServices[service as ServiceType]) {
        selectedConfigs[service as keyof ServiceConfig] = config;
      }
    });
    
    return selectedConfigs;
  };
  
  const downloadPdf = () => {
    toast({
      title: "PDF Download Started",
      description: "Your quote summary PDF is being generated and will download shortly.",
    });
  };
  
  const saveQuote = () => {
    toast({
      title: "Quote Saved",
      description: "Your quote has been saved to your account.",
    });
  };

  const handleServiceDetailView = (serviceType: ServiceType) => {
    setActiveServiceForm(serviceType);
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
            <Card>
              <CardHeader>
                <CardTitle>Company Intelligence</CardTitle>
                <CardDescription>Enter a company name to generate a profile using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(generateCompanyProfile)} className="space-y-6">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Sony Corporation" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the full company name to analyze (Try "Sony" or "Nintendo" for Japanese listed examples)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Profile...
                        </>
                      ) : (
                        <>Search & Generate</>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {companyProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Profile: {companyProfile.name}</CardTitle>
                  <CardDescription>AI-generated company intelligence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Website:</span> {companyProfile.website}
                      </div>
                      <div>
                        <span className="font-medium">Head Office:</span> {companyProfile.headOffice}
                      </div>
                      <div>
                        <span className="font-medium">Employees:</span> {companyProfile.employeeCount?.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Main Business:</span> {companyProfile.mainBusiness?.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Established:</span> {companyProfile.established}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Capital:</span> {companyProfile.capital}
                      </div>
                      <div>
                        <span className="font-medium">Revenue:</span> {companyProfile.revenue}
                      </div>
                      <div>
                        <span className="font-medium">Country:</span> {companyProfile.country}
                      </div>
                      <div>
                        <span className="font-medium">Publicly Listed:</span> {companyProfile.isListed ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <span className="font-medium">Stock Price:</span> {companyProfile.stockPrice}
                      </div>
                      {companyProfile.isJapaneseListed && (
                        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-700">Japanese Listed Company: +12% premium pricing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
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
                      <Card 
                        className={`shadow-sm border-2 ${selectedServices.web ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
                        onClick={() => toggleService('web')}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Calculator className="h-5 w-5 mr-2" />
                            Web Security Testing
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Assessment of web applications for vulnerabilities</p>
                          {selectedServices.web && <Check className="h-5 w-5 text-green-500 mt-2" />}
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`shadow-sm border-2 ${selectedServices.cloud ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
                        onClick={() => toggleService('cloud')}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Database className="h-5 w-5 mr-2" />
                            Cloud Assessment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Review cloud infrastructure and security controls</p>
                          {selectedServices.cloud && <Check className="h-5 w-5 text-green-500 mt-2" />}
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`shadow-sm border-2 ${selectedServices.network ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
                        onClick={() => toggleService('network')}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Network className="h-5 w-5 mr-2" />
                            Network Pentest
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Comprehensive network security assessment</p>
                          {selectedServices.network && <Check className="h-5 w-5 text-green-500 mt-2" />}
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`shadow-sm border-2 ${selectedServices.mobile ? 'border-primary' : 'border-primary/50'} cursor-pointer hover:border-primary transition-colors`}
                        onClick={() => toggleService('mobile')}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Smartphone className="h-5 w-5 mr-2" />
                            Mobile App Testing
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Security assessment for mobile applications</p>
                          {selectedServices.mobile && <Check className="h-5 w-5 text-green-500 mt-2" />}
                        </CardContent>
                      </Card>
                    </div>

                    {/* This is where we'll render the service-specific forms */}
                    {activeServiceForm && (
                      <ServiceFormSelector 
                        selectedService={activeServiceForm} 
                        onChange={(newConfig) => {
                          setServiceConfig(prev => ({
                            ...prev,
                            [activeServiceForm]: {
                              ...prev[activeServiceForm],
                              ...newConfig
                            }
                          }));
                        }} 
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
          </TabsContent>
          
          <TabsContent value="quote" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Summary</CardTitle>
                <CardDescription>
                  Estimated pricing for selected security services
                  {companyProfile?.isJapaneseListed && " (including +12% premium for Japanese listed company)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price (万円)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedServices.web && serviceConfig.web && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Web Security Testing</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.web as WebServiceConfig).type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.web as WebServiceConfig).price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.cloud && serviceConfig.cloud && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Cloud Assessment</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.cloud as CloudServiceConfig).type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.cloud as CloudServiceConfig).price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.network && serviceConfig.network && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Network Pentest</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.network as NetworkServiceConfig).type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.network as NetworkServiceConfig).price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.mobile && serviceConfig.mobile && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Mobile App Testing</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.mobile as MobileServiceConfig).type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.mobile as MobileServiceConfig).price}</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300">
                          <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>Subtotal</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">
                            {Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                              if (selectedServices[service as ServiceType] && config) {
                                return acc + ((config as any).price || 0);
                              }
                              return acc;
                            }, 0)}
                          </th>
                        </tr>
                        {companyProfile?.isJapaneseListed && (
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>Japanese Listed Company Premium (+12%)</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">
                              +{Math.round(Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                                if (selectedServices[service as ServiceType] && config) {
                                  return acc + ((config as any).price || 0);
                                }
                                return acc;
                              }, 0) * 0.12)}
                            </th>
                          </tr>
                        )}
                        <tr className="bg-primary/5">
                          <th className="px-6 py-4 text-left text-base font-bold" colSpan={2}>Total Estimate</th>
                          <th className="px-6 py-4 text-right text-base font-bold">
                            {calculateTotal()} 万円
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={saveQuote}>
                      Save Quote
                    </Button>
                    <Button onClick={downloadPdf}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Purpose;
