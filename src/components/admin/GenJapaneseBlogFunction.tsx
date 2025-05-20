
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const GenJapaneseBlogFunction: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLog, setGenerationLog] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('ブログタイトルを入力してください');
      return;
    }

    setIsGenerating(true);
    setGenerationLog('OpenAIに日本語ブログ生成をリクエスト中...\n');
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-japanese-blog', {
        body: { title: title.trim() }
      });

      if (error) throw error;

      setGenerationLog(prev => prev + 'タイトルと内容を処理しています...\n');
      setTimeout(() => {
        setGenerationLog(prev => prev + '脅威モデリングと技術分析を生成中...\n');
        
        setTimeout(() => {
          setGenerationLog(prev => prev + '対策推奨事項とリファレンス情報を追加中...\n');
          
          setTimeout(() => {
            setGenerationLog(prev => prev + `ブログ記事の生成が完了しました！ID: ${data.vulnerabilityId}\n`);
            setIsGenerating(false);
            toast.success('日本語ブログ記事が正常に生成されました');
            
            // Navigate to the blog detail page
            navigate(`/blog/${data.vulnerabilityId}`);
          }, 1000);
        }, 1000);
      }, 1000);
    } catch (err) {
      console.error("Error generating blog:", err);
      setGenerationLog(prev => prev + `エラーが発生しました: ${err.message || 'Unknown error'}\n`);
      setIsGenerating(false);
      toast.error('ブログ記事の生成中にエラーが発生しました');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>日本語セキュリティブログを生成</CardTitle>
        <CardDescription>
          脆弱性のタイトルを日本語で入力すると、AIが自動的に包括的なセキュリティブログ記事を生成します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="blogTitle" className="text-sm font-medium">
              ブログタイトル（日本語）
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
              <label className="text-sm font-medium">生成ログ</label>
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
              ブログ記事を生成中...
            </>
          ) : 'ブログ記事を生成'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GenJapaneseBlogFunction;
