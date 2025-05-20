
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const Purpose = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  
  // Company Intelligence Form
  const companyForm = useForm({
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
        const mockProfile: CompanyProfile = {
          name: data.companyName,
          website: data.companyName.toLowerCase().replace(/\s+/g, '') + '.com',
          headOffice: data.companyName.includes('Sony') ? 'Tokyo, Japan' : 'Unknown',
          employeeCount: data.companyName.includes('Sony') ? 114000 : Math.floor(Math.random() * 10000),
          mainBusiness: data.companyName.includes('Sony') ? ['Electronics', 'Entertainment', 'Financial Services'] : ['Technology'],
          established: data.companyName.includes('Sony') ? '1946' : '2000',
          capital: data.companyName.includes('Sony') ? '¥880.24 billion' : 'Unknown',
          revenue: data.companyName.includes('Sony') ? '¥11.54 trillion' : 'Unknown',
          dataBreaches: [],
          isListed: data.companyName.includes('Sony'),
          stockPrice: data.companyName.includes('Sony') ? '¥14,000' : 'N/A',
          country: data.companyName.includes('Sony') ? 'Japan' : 'Unknown',
          isJapaneseListed: data.companyName.includes('Sony'),
        };
        
        setCompanyProfile(mockProfile);
        toast({
          title: "Company Profile Generated",
          description: `Successfully retrieved information about ${data.companyName}`,
        });
        
        // Move to services tab after profile is generated
        setActiveTab('services');
        setIsLoading(false);
      }, 2000);
      
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
  
  const moveToQuotation = () => {
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
            <TabsTrigger value="quote" disabled={!companyProfile}>Quotation</TabsTrigger>
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
                            Enter the full company name to analyze
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
                    <Card className="shadow-sm border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Web Security Testing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Assessment of web applications for vulnerabilities</p>
                        <Check className="h-5 w-5 text-green-500 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cloud Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Review cloud infrastructure and security controls</p>
                        <Check className="h-5 w-5 text-green-500 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Network Pentest</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Comprehensive network security assessment</p>
                        <Check className="h-5 w-5 text-green-500 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Mobile App Testing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Security assessment for mobile applications</p>
                        <Check className="h-5 w-5 text-green-500 mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={moveToQuotation}>
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
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Web Security Testing</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Corporate Website</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">150</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Cloud Assessment</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Mid-Level Infra</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">300</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Network Pentest</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Secure External Network</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">250</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300">
                          <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>Subtotal</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">700</th>
                        </tr>
                        {companyProfile?.isJapaneseListed && (
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>Japanese Listed Company Premium (+12%)</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">+84</th>
                          </tr>
                        )}
                        <tr className="bg-primary/5">
                          <th className="px-6 py-4 text-left text-base font-bold" colSpan={2}>Total Estimate</th>
                          <th className="px-6 py-4 text-right text-base font-bold">
                            {companyProfile?.isJapaneseListed ? '784' : '700'} 万円
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-4 mt-6">
                    <Button variant="outline">
                      Save Quote
                    </Button>
                    <Button>
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
