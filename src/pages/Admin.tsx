
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminActionCard from '@/components/admin/AdminActionCard';
import StatsCard from '@/components/admin/StatsCard';
import GenJapaneseBlogFunction from '@/components/admin/GenJapaneseBlogFunction';
import { BookOpenCheck, Database, Bot } from 'lucide-react';

const Admin = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage vulnerability data and AI-powered content generation
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Vulnerabilities"
            value="4,228"
            description="CVE entries in database"
            icon={<Database className="h-5 w-5" />}
          />
          <StatsCard
            title="AI Enhanced"
            value="3,182"
            description="Reports with AI analysis"
            icon={<Bot className="h-5 w-5" />}
          />
          <StatsCard
            title="Japanese Blogs"
            value="14"
            description="AI-generated security blogs"
            icon={<BookOpenCheck className="h-5 w-5" />}
          />
        </div>

        <Tabs defaultValue="vulndb">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="vulndb">Vulnerability Database</TabsTrigger>
            <TabsTrigger value="japblog">Japanese Blog Generator</TabsTrigger>
          </TabsList>
          
          {/* Vulnerability Database Tab */}
          <TabsContent value="vulndb">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminActionCard
                title="Fetch CVEs from RSS Feed"
                description="Download the latest CVE entries from the official RSS feed"
                buttonText="Fetch Latest CVEs"
                icon={<Database className="h-5 w-5" />}
                onClick={() => alert('This feature is not yet implemented')}
              />
              
              <AdminActionCard
                title="AI Enrich CVE Data"
                description="Process raw CVE data with OpenAI to add technical analysis and business impact"
                buttonText="Start AI Enrichment"
                icon={<Bot className="h-5 w-5" />}
                onClick={() => alert('This feature is not yet implemented')}
              />
            </div>
          </TabsContent>
          
          {/* Japanese Blog Generator Tab */}
          <TabsContent value="japblog">
            <Card>
              <CardHeader>
                <CardTitle>Japanese Security Blog Generator</CardTitle>
                <CardDescription>
                  Generate comprehensive security blog posts in Japanese using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenJapaneseBlogFunction />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
