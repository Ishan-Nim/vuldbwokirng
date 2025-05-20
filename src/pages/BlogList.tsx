
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, BookOpen, Search, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';

interface Vulnerability {
  id: string;
  title: string;
  severity: string;
  description: string;
  created_at: string;
}

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Vulnerability[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('vulnerabilities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setBlogs(data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("ブログ記事の取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            セキュリティブログ
          </h1>
          <p className="text-muted-foreground mt-1">
            AIが生成した日本語のセキュリティブログ記事を閲覧する
          </p>
        </div>

        <div className="w-full flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="タイトルや内容で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchQuery('')}
            >
              クリア
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredBlogs.length === 0 ? (
          searchQuery ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>該当する結果がありません</AlertTitle>
              <AlertDescription>
                「{searchQuery}」に一致するブログ記事はありません。検索条件を変更してみてください。
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>ブログ記事がありません</AlertTitle>
              <AlertDescription>
                まだブログ記事が投稿されていません。管理者パネルから新しいブログ記事を生成してください。
              </AlertDescription>
            </Alert>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge className={`${blog.severity === '高' ? 'bg-destructive' : blog.severity === '中' ? 'bg-warning' : 'bg-success'}`}>
                      {blog.severity}リスク
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(blog.created_at)}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {blog.description || "詳細はありません。"}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto" 
                    onClick={() => navigate(`/blog/${blog.id}`)}
                  >
                    詳細を見る <ArrowRightIcon className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogList;
