
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminActionCard from '@/components/admin/AdminActionCard';
import JapaneseBlogGenerator from '@/components/admin/JapaneseBlogGenerator';
import StatsCard from '@/components/admin/StatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Database, BarChart3, RefreshCw, Cpu, ShieldAlert, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [isFetchingCVEs, setIsFetchingCVEs] = useState(false);
  const [isEnrichingPosts, setIsEnrichingPosts] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleFetchCVEs = () => {
    setIsFetchingCVEs(true);
    setLogMessages(prev => [...prev, "Starting CVE fetch from RSS feed..."]);
    
    // Simulate API call
    setTimeout(() => {
      setLogMessages(prev => [...prev, "Connected to https://cvefeed.io/rssfeed/latest.xml"]);
      
      setTimeout(() => {
        setLogMessages(prev => [...prev, "Downloading latest CVE entries..."]);
        
        setTimeout(() => {
          setLogMessages(prev => [...prev, "Processing and storing 12 new CVE entries..."]);
          
          setTimeout(() => {
            setLogMessages(prev => [...prev, "Successfully fetched and stored 12 new CVE entries"]);
            setIsFetchingCVEs(false);
            toast.success("Successfully fetched 12 new CVE entries");
          }, 1000);
        }, 1500);
      }, 1000);
    }, 1000);
  };

  const handleEnrichPosts = () => {
    setIsEnrichingPosts(true);
    setLogMessages(prev => [...prev, "Starting AI enrichment process for raw CVE posts..."]);
    
    // Simulate API call
    setTimeout(() => {
      setLogMessages(prev => [...prev, "Connecting to OpenAI API..."]);
      
      setTimeout(() => {
        setLogMessages(prev => [...prev, "Processing 8 unenriched CVE posts..."]);
        
        setTimeout(() => {
          setLogMessages(prev => [...prev, "Enriching CVE-2025-4866..."]);
          
          setTimeout(() => {
            setLogMessages(prev => [...prev, "Enriching CVE-2025-4870..."]);
            
            setTimeout(() => {
              setLogMessages(prev => [...prev, "Successfully enriched and stored 8 CVE entries with AI analysis"]);
              setIsEnrichingPosts(false);
              toast.success("Successfully enriched 8 CVE entries with AI");
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1000);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vulnerability database and AI-powered content generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Vulnerabilities" 
            value="761"
            description="Last 30 days" 
            trend={{ value: 12, isPositive: true }}
            icon={<ShieldAlert />} 
          />
          <StatsCard 
            title="AI-Enriched Posts" 
            value="723" 
            description="95% of database"
            icon={<Cpu />}
          />
          <StatsCard 
            title="Japanese Blog Posts" 
            value="42"
            description="Generated content" 
            icon={<FileText />}
          />
          <StatsCard 
            title="API Requests" 
            value="1,204"
            description="Last 30 days" 
            trend={{ value: 8, isPositive: true }}
            icon={<BarChart3 />}
          />
        </div>

        <Tabs defaultValue="actions">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="actions">Admin Actions</TabsTrigger>
            <TabsTrigger value="japanese">Japanese Blog Generator</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminActionCard 
                title="Fetch CVEs from RSS"
                description="Download and store the latest CVEs from the RSS feed"
                buttonText="Fetch Latest CVEs"
                icon={<Database className="h-5 w-5" />}
                isLoading={isFetchingCVEs}
                onClick={handleFetchCVEs}
              />
              
              <AdminActionCard 
                title="AI Enrich CVE Posts"
                description="Process raw CVE posts with OpenAI to add enriched analysis"
                buttonText="Enrich CVE Posts"
                icon={<Cpu className="h-5 w-5" />}
                isLoading={isEnrichingPosts}
                onClick={handleEnrichPosts}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="japanese">
            <JapaneseBlogGenerator />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  System Activity Logs
                </CardTitle>
                <CardDescription>
                  Real-time logs of system operations and API interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logMessages.length > 0 ? (
                  <div className="bg-muted/50 rounded-md p-4 h-64 overflow-y-auto font-mono text-sm">
                    {logMessages.map((message, index) => (
                      <div key={index} className="pb-1">
                        <span className="text-muted-foreground">[{new Date().toISOString()}]</span>{" "}
                        {message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No recent activity</AlertTitle>
                    <AlertDescription>
                      Perform actions to see logs appear here.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
