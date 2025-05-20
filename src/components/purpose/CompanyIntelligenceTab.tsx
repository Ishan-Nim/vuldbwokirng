
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Edit } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CompanyProfile } from '@/types/purpose';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
    },
  });

  const generateCompanyProfile = async (data: { companyName: string }) => {
    if (!data.companyName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call our Supabase Edge Function
      const { data: responseData, error: functionError } = await supabase.functions.invoke('company-profile', {
        body: { companyName: data.companyName }
      });
      
      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to generate company profile');
      }
      
      const profileData = responseData.profile;
      
      // Create the company profile from the returned data
      const profile: CompanyProfile = {
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
      
      setCompanyProfile(profile);
      toast({
        title: "Company Profile Generated",
        description: `Successfully retrieved information about ${profile.name}`,
      });
      
      // Move to services tab after profile is generated
      moveToNextTab();
      
    } catch (error) {
      console.error('Error generating company profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate company profile');
      
      // Fallback to simulated data
      createFallbackProfile(data.companyName);
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackProfile = (companyName: string) => {
    // Fallback to simulated data on API error
    const isJapaneseListed = companyName.toLowerCase().includes('sony') || 
                        companyName.toLowerCase().includes('toyota') ||
                        companyName.toLowerCase().includes('nintendo') ||
                        companyName.includes('株式会社');
    
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to generate company profile. Using simulated data.",
    });
    
    const mockProfile: CompanyProfile = {
      name: companyName,
      website: companyName.toLowerCase().replace(/\s+/g, '') + '.com',
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
  };
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save updated profile and show confirmation
    toast({
      title: "Profile Updated",
      description: "Company profile has been successfully updated."
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Company Intelligence</CardTitle>
          <CardDescription>Enter a company name to generate a profile using AI</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
                      Enter the full company name to analyze (Try "Sony" or "Nintendo" for Japanese listed examples, or "株式会社エスプール" for Japanese companies)
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Company Profile: {companyProfile.name}</CardTitle>
              <CardDescription>AI-generated company intelligence</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditProfile} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Website</label>
                      <Input 
                        defaultValue={companyProfile.website}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          website: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Head Office</label>
                      <Input 
                        defaultValue={companyProfile.headOffice}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          headOffice: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Employees</label>
                      <Input 
                        type="number"
                        defaultValue={companyProfile.employeeCount}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          employeeCount: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Main Business</label>
                      <Input 
                        defaultValue={companyProfile.mainBusiness?.join(', ')}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          mainBusiness: e.target.value.split(',').map(item => item.trim())
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Established</label>
                      <Input 
                        defaultValue={companyProfile.established}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          established: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Capital</label>
                      <Input 
                        defaultValue={companyProfile.capital}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          capital: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Revenue</label>
                      <Input 
                        defaultValue={companyProfile.revenue}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          revenue: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Country</label>
                      <Input 
                        defaultValue={companyProfile.country}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          country: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
            ) : (
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
            )}
            
            {!isEditing && companyProfile && (
              <div className="mt-5 flex justify-end">
                <Button onClick={moveToNextTab}>Next: Configure Services</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyIntelligenceTab;
