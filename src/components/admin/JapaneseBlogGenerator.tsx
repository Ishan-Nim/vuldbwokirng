
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const JapaneseBlogGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLog, setGenerationLog] = useState('');

  const handleGenerate = () => {
    if (!title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }

    setIsGenerating(true);
    setGenerationLog('Submitting title to OpenAI for Japanese blog generation...\n');
    
    // Simulate API call with timeout
    setTimeout(() => {
      setGenerationLog(prev => prev + 'Processing title and context...\n');
      
      setTimeout(() => {
        setGenerationLog(prev => prev + 'Generating comprehensive security analysis...\n');
        
        setTimeout(() => {
          setGenerationLog(prev => prev + 'Creating structured blog content with threat modeling...\n');
          
          setTimeout(() => {
            setGenerationLog(prev => prev + 'Adding technical references and mitigation strategies...\n');
            
            setTimeout(() => {
              setGenerationLog(prev => prev + 'Blog post generation complete! Post has been saved to the database.\n');
              setIsGenerating(false);
              toast.success('Japanese blog post successfully generated');
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Japanese Security Blog</CardTitle>
        <CardDescription>
          Enter a vulnerability title in Japanese to automatically generate a comprehensive security blog post
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
              placeholder="例：SQLインジェクション脆弱性の分析"
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
              Generating Blog Post...
            </>
          ) : 'Generate Blog Post'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JapaneseBlogGenerator;
