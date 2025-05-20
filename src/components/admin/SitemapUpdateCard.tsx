
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface SitemapUpdateCardProps {
  onLogUpdate: (logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>) => void;
}

const SitemapUpdateCard: React.FC<SitemapUpdateCardProps> = ({ onLogUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSitemap = async () => {
    setIsUpdating(true);
    
    try {
      // Log start of update
      onLogUpdate([{
        timestamp: new Date().toLocaleTimeString(),
        message: "サイトマップの更新を開始します...",
        type: 'info'
      }]);
      
      // Call the scheduled-tasks function with update-sitemap task
      const { data, error } = await supabase.functions.invoke('scheduled-tasks', {
        body: { task: 'update-sitemap' }
      });

      if (error) {
        throw error;
      }

      // Update logs with success message
      onLogUpdate([{
        timestamp: new Date().toLocaleTimeString(),
        message: "サイトマップが正常に更新されました。すべてのブログ投稿が含まれています。",
        type: 'success'
      }]);

      toast.success('サイトマップを更新しました');
    } catch (err: any) {
      console.error('サイトマップの更新中にエラーが発生しました:', err);
      
      // Update logs with error message
      onLogUpdate([{
        timestamp: new Date().toLocaleTimeString(),
        message: `エラー: ${err.message || 'サイトマップの更新に失敗しました'}`,
        type: 'error'
      }]);
      
      toast.error('サイトマップの更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Sitemap</CardTitle>
        <CardDescription>
          Generate a new sitemap.xml with all published blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Sitemap generation happens automatically when new blog posts are created.
          Use this button to manually regenerate the sitemap.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleUpdateSitemap}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Sitemap...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Sitemap
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
};

export default SitemapUpdateCard;
