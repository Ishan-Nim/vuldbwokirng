
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const GenJapaneseBlogFunction: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLog, setGenerationLog] = useState('');
  const [generatedBlogId, setGeneratedBlogId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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

          {/* Display generated blog link */}
          {generatedBlogId && (
            <div className="border rounded-md p-3 bg-muted/30">
              <label className="text-sm font-medium block mb-2">Generated Blog URL</label>
              <div className="flex items-center space-x-2">
                <Input 
                  readOnly
                  value={`${window.location.origin}/blog/${generatedBlogId}`}
                  className="text-xs font-mono bg-background"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={visitBlog}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
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
  );
};

export default GenJapaneseBlogFunction;
