
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartPie, Users, Globe, ArrowDownUp, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Example data - in a real application, this would be fetched from the GA4 API
const mockSessionsData = Array.from({ length: 30 }, (_, i) => ({
  date: `${new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
  sessions: Math.floor(Math.random() * 50) + 10,
}));

const mockUsersData = Array.from({ length: 30 }, (_, i) => ({
  date: `${new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
  users: Math.floor(Math.random() * 40) + 5,
}));

const mockPageViewsData = [
  { page: '/', views: 145 },
  { page: '/blog', views: 87 },
  { page: '/blog/cve-2023-1234', views: 56 },
  { page: '/purpose', views: 42 },
  { page: '/blog/cve-2023-5678', views: 38 },
];

const mockSourcesData = [
  { source: 'Direct', sessions: 120 },
  { source: 'Organic Search', sessions: 85 },
  { source: 'Social', sessions: 43 },
  { source: 'Referral', sessions: 37 },
  { source: 'Email', sessions: 25 },
];

const AnalyticsPanel: React.FC = () => {
  const [activeChart, setActiveChart] = useState('sessions');
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real application, this would fetch data from the GA4 API based on the selected date range
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    fetchAnalyticsData();
  }, [dateRange]);
  
  const sessions = mockSessionsData.reduce((sum, item) => sum + item.sessions, 0);
  const users = mockUsersData.reduce((sum, item) => sum + item.users, 0);
  const pageViews = mockPageViewsData.reduce((sum, item) => sum + item.views, 0);
  const bounceRate = 48.2; // Example bounce rate
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsLoading(true)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard 
          title="Sessions" 
          value={sessions}
          description={`Last ${dateRange} days`}
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Users" 
          value={users}
          description={`Last ${dateRange} days`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Page Views" 
          value={pageViews}
          description={`Last ${dateRange} days`}
          icon={<ChartPie className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Bounce Rate" 
          value={`${bounceRate}%`}
          description={`Last ${dateRange} days`}
          icon={<ArrowDownUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="mb-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
              <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSessionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="users" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockUsersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pages" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPageViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="sources" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSourcesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground mt-2">
        <p>Note: This dashboard displays mock data for demonstration purposes. In a real implementation, you would connect to the Google Analytics API to fetch actual analytics data.</p>
        <p className="mt-1">To view real analytics data, please visit the <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics website</a> and log in with your account credentials.</p>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
