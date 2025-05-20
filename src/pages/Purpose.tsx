
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle, Calculator, Database, Network, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type CompanyProfile = {
  name: string;
  website?: string;
  headOffice?: string;
  employeeCount?: number;
  mainBusiness?: string[];
  established?: string;
  capital?: string;
  revenue?: string;
  dataBreaches?: string[];
  isListed?: boolean;
  stockPrice?: string;
  country?: string;
  isJapaneseListed?: boolean;
};

type ServiceType = 'web' | 'cloud' | 'network' | 'mobile';

type ServiceConfig = {
  web?: {
    type: string;
    pages?: number;
    loginComplexity?: string;
    technologies?: string[];
    price: number;
  };
  cloud?: {
    type: string;
    accounts?: number;
    providers?: string[];
    scope?: string[];
    price: number;
  };
  network?: {
    type: string;
    internal?: boolean;
    ipCount?: number;
    vpn?: boolean;
    price: number;
  };
  mobile?: {
    type: string;
    count?: number;
    platforms?: string[];
    codeAccess?: boolean;
    price: number;
  };
};

const companySchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
});

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
  
  // Company Intelligence Form
  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
    },
  });

  const generateCompanyProfile = async (data: { companyName: string }) => {
    if (!data.companyName) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call a Supabase Edge Function to use ChatGPT API
      // For demo purposes, we'll simulate the response with a timeout
      setTimeout(() => {
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
          description: `Successfully retrieved information about ${data.companyName}`,
        });
        
        // Move to services tab after profile is generated
        setActiveTab('services');
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating company profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate company profile. Please try again.",
      });
      setIsLoading(false);
    }
  };
  
  const toggleService = (service: ServiceType) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));

    // Initialize service config with default prices based on service type
    if (!serviceConfig[service]) {
      const defaultConfig: any = {};
      
      switch (service) {
        case 'web':
          defaultConfig.type = 'Corporate Website';
          defaultConfig.price = 150;
          break;
        case 'cloud':
          defaultConfig.type = 'Mid-Level Infra';
          defaultConfig.price = 300;
          break;
        case 'network':
          defaultConfig.type = 'Secure External Network';
          defaultConfig.price = 250;
          break;
        case 'mobile':
          defaultConfig.type = 'Mid-Level App';
          defaultConfig.price = 200;
          break;
      }
      
      setServiceConfig(prev => ({
        ...prev,
        [service]: defaultConfig
      }));
    }
  };
  
  const moveToQuotation = () => {
    setQuoteGenerated(true);
    setActiveTab('quote');
  };
  
  const calculateTotal = () => {
    let total = 0;
    
    Object.entries(serviceConfig).forEach(([service, config]) => {
      if (selectedServices[service as ServiceType]) {
        total += config.price || 0;
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
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={moveToQuotation}
                      disabled={!Object.values(selectedServices).some(v => v)}
                    >
                      Calculate Quote
                    </Button>
                  </div>
                </div>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{serviceConfig.web.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{serviceConfig.web.price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.cloud && serviceConfig.cloud && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Cloud Assessment</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{serviceConfig.cloud.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{serviceConfig.cloud.price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.network && serviceConfig.network && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Network Pentest</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{serviceConfig.network.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{serviceConfig.network.price}</td>
                          </tr>
                        )}
                        
                        {selectedServices.mobile && serviceConfig.mobile && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Mobile App Testing</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{serviceConfig.mobile.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{serviceConfig.mobile.price}</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300">
                          <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>Subtotal</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">
                            {Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                              if (selectedServices[service as ServiceType]) {
                                return acc + (config.price || 0);
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
                                if (selectedServices[service as ServiceType]) {
                                  return acc + (config.price || 0);
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
