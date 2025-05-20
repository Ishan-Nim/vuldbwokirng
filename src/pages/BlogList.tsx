
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Vulnerability {
  id: string;
  title: string;
  severity: string;
  risk_rating: string;
  description: string;
  created_at: string;
}

const POSTS_PER_PAGE = 20;

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        
        // Get only AI-generated blogs (those with severity populated and proper Japanese content)
        const { data, error, count } = await supabase
          .from('vulnerabilities')
          .select('*', { count: 'exact' })
          .not('severity', 'is', null)
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);
        
        if (error) throw error;
        
        // Filter out raw vulnerability posts (those with CVE IDs in the title)
        const filteredBlogs = data?.filter(blog => {
          // Filter out posts that contain CVE IDs in the title
          return !blog.title.includes('CVE-') && blog.severity !== null;
        }) || [];
        
        // Remove any duplicates based on title
        const uniqueBlogs = filteredBlogs.filter((blog, index, self) => 
          index === self.findIndex((t) => t.title === blog.title)
        );
        
        setBlogs(uniqueBlogs);
        
        if (count) {
          setTotalPages(Math.ceil(count / POSTS_PER_PAGE));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
          title: 'ブログの取得エラー',
          description: `ブログ記事を取得できませんでした: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
  }, [currentPage]);

  const handleReadMore = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Function to get severity badge color
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case '高':
        return 'bg-destructive';
      case '中':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };

  // Function to truncate description but keep it longer than before
  const truncateDescription = (desc: string) => {
    return desc.length > 300 ? desc.substring(0, 300) + '...' : desc;
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If there are less than maxPagesToShow total pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range to always show maxPagesToShow-2 pages (accounting for first and last)
      if (end - start + 1 < maxPagesToShow - 2) {
        if (start === 2) {
          end = Math.min(start + (maxPagesToShow - 3), totalPages - 1);
        } else if (end === totalPages - 1) {
          start = Math.max(end - (maxPagesToShow - 3), 2);
        }
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add range of pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            セキュリティブログ
          </h1>
          <p className="text-muted-foreground mt-1">
            AIによって生成された日本語のセキュリティ脆弱性分析と対策
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, idx) => (
              <BlogCardSkeleton key={idx} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ブログ記事がありません</AlertTitle>
            <AlertDescription>
              管理パネルから「日本語ブログ生成」機能を使用して、セキュリティブログを生成してください。
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getSeverityBadgeClass(blog.severity)}>
                        {blog.severity}リスク
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(blog.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-6">
                      {truncateDescription(blog.description)}
                    </p>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{blog.risk_rating}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReadMore(blog.id)}
                        className="flex items-center"
                      >
                        詳細を見る
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                  
                  {getPageNumbers().map((pageNum, idx) => (
                    <PaginationItem key={idx}>
                      {pageNum < 0 ? (
                        <span className="px-4 py-2">...</span>
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogList;
