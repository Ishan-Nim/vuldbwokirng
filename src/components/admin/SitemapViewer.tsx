
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

const SitemapViewer: React.FC = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sitemapUrl = `${window.location.origin}/sitemap.xml`;

  const fetchSitemap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(sitemapUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      setSitemapContent(text);
      toast.success("Sitemap loaded successfully");
    } catch (err: any) {
      console.error("Error fetching sitemap:", err);
      setError(err.message || "Failed to fetch sitemap");
      toast.error("Failed to load sitemap");
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(sitemapUrl, '_blank');
  };

  useEffect(() => {
    fetchSitemap();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Sitemap Viewer</span>
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </CardTitle>
        <CardDescription>
          View your current sitemap content - <code>{sitemapUrl}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md text-destructive">
            <p className="font-medium">Error loading sitemap</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <Textarea 
            value={sitemapContent} 
            readOnly
            className="h-[300px] font-mono text-xs bg-muted"
            spellCheck={false}
          />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={fetchSitemap}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              navigator.clipboard.writeText(sitemapUrl);
              toast.success('Sitemap URL copied to clipboard');
            }}
          >
            <FileText className="mr-2 h-4 w-4" /> 
            Copy URL
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SitemapViewer;
