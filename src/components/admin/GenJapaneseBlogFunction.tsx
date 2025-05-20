
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import ProcessingLogs from './ProcessingLogs';

interface BlogLink {
  id: string;
  title: string;
  timestamp: string;
}

const GenJapaneseBlogFunction: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLog, setGenerationLog] = useState('');
  const [generatedBlogId, setGeneratedBlogId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogLink[]>([]);
  const navigate = useNavigate();

  // Fetch previously generated blogs on component mount
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('vulnerabilities')
          .select('id, title, created_at')
          .not('title', 'ilike', 'CVE-%')
          .order('created_at', { ascending: false })
          .limit(10); // Increased limit to show more blogs

        if (error) throw error;
        
        if (data) {
          const blogLinks: BlogLink[] = data.map(item => ({
            id: item.id,
            title: item.title,
            timestamp: new Date(item.created_at).toLocaleString()
          }));
          setGeneratedBlogs(blogLinks);
        }
      } catch (err) {
        console.error('Error fetching recent blogs:', err);
      }
    };

    fetchRecentBlogs();
  }, []);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }

    setIsGenerating(true);
    setGenerationLog('Requesting Japanese blog generation from OpenAI...\n');
    setGeneratedBlogId(null);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-japanese-blog', {
        body: { title: title.trim() }
      });

      if (error) {
        throw new Error(`Error invoking function: ${error.message}`);
      }

      if (!data || !data.vulnerabilityId) {
        throw new Error('Invalid response from server');
      }

      setGenerationLog(prev => prev + 'Processing title and content...\n');
      setTimeout(() => {
        setGenerationLog(prev => prev + 'Generating threat modeling and technical analysis...\n');
        
        setTimeout(() => {
          setGenerationLog(prev => prev + 'Adding remediation recommendations and references...\n');
          
          setTimeout(() => {
            setGenerationLog(prev => prev + `Blog post generation complete! ID: ${data.vulnerabilityId}\n`);
            setIsGenerating(false);
            setGeneratedBlogId(data.vulnerabilityId);
            
            // Add the new blog to the list
            const newBlog: BlogLink = {
              id: data.vulnerabilityId,
              title: title,
              timestamp: new Date().toLocaleString()
            };
            setGeneratedBlogs(prev => [newBlog, ...prev]);
            
            toast.success('Japanese blog post successfully generated');
          }, 1000);
        }, 1000);
      }, 1000);
    } catch (err: any) {
      console.error("Error generating blog:", err);
      setGenerationLog(prev => prev + `Error occurred: ${err.message || 'Unknown error'}\n`);
      setIsGenerating(false);
      toast.error('Failed to generate blog post: ' + (err.message || 'Unknown error'));
    }
  };

  const copyToClipboard = () => {
    if (!generatedBlogId) return;
    
    const blogUrl = `${window.location.origin}/blog/${generatedBlogId}`;
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    toast.success('Blog URL copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const visitBlog = () => {
    if (generatedBlogId) {
      navigate(`/blog/${generatedBlogId}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate Japanese Security Blog</CardTitle>
          <CardDescription>
            Enter a vulnerability title in Japanese and AI will automatically generate a comprehensive security blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="blogTitle" className="text-sm font-medium">
                Blog Title (Japanese)
              </label>
              <Input
                id="blogTitle"
                placeholder="Example: SQLインジェクション脆弱性の分析"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            
            {generationLog && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Generation Log</label>
                <Textarea 
                  value={generationLog} 
                  readOnly 
                  className="h-40 font-mono text-xs bg-muted"
                />
              </div>
            )}

            {/* Display generated blog link - HIGHLIGHTED AND MORE PROMINENT NOW */}
            {generatedBlogId && (
              <div className="border-2 rounded-md p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <label className="text-sm font-medium block mb-2 text-blue-700 dark:text-blue-300">Generated Blog URL</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Input 
                      readOnly
                      value={`${window.location.origin}/blog/${generatedBlogId}`}
                      className="text-xs font-mono bg-background"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={copyToClipboard}
                      className="w-full sm:w-auto"
                    >
                      {copied ? (
                        <><CheckCheck className="h-4 w-4 mr-2" /> Copied</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-2" /> Copy Link</>
                      )}
                    </Button>
                    <Button 
                      onClick={visitBlog}
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> View Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={isGenerating || !title.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating blog post...
              </>
            ) : 'Generate Blog Post'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Add ProcessingLogs component to display generated blog links */}
      <ProcessingLogs 
        title="Manually Generated Blog Posts" 
        description="Your Japanese blog posts ready to view or share"
        blogLinks={generatedBlogs}
      />
    </div>
  );
};

export default GenJapaneseBlogFunction;
