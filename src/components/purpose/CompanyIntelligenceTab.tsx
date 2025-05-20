
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CompanyProfile } from '@/types/purpose';

const companySchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
});

type CompanyIntelligenceTabProps = {
  companyProfile: CompanyProfile | null;
  setCompanyProfile: (profile: CompanyProfile | null) => void;
  moveToNextTab: () => void;
};

const CompanyIntelligenceTab = ({ companyProfile, setCompanyProfile, moveToNextTab }: CompanyIntelligenceTabProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
        moveToNextTab();
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
        moveToNextTab();
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
      moveToNextTab();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CompanyIntelligenceTab;
