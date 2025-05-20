
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScheduledTasks } from '@/components/admin/useScheduledTasks';
import StatisticsTab from '@/components/admin/StatisticsTab';
import ActionsTab from '@/components/admin/ActionsTab';
import GeneratorsTab from '@/components/admin/GeneratorsTab';
import SitemapTab from '@/components/admin/SitemapTab';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const { fetchTask, enrichTask, blogGenTask } = useScheduledTasks();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="generators">Generators</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          <StatisticsTab />
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <ActionsTab 
            fetchTask={fetchTask} 
            enrichTask={enrichTask} 
            blogGenTask={blogGenTask} 
          />
        </TabsContent>
        
        <TabsContent value="generators" className="space-y-4">
          <GeneratorsTab blogGenTask={blogGenTask} />
        </TabsContent>
        
        <TabsContent value="sitemap" className="space-y-4">
          <SitemapTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
