
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import VulnerabilityCard from '@/components/vulnerabilities/VulnerabilityCard';
import { Pagination } from '@/components/ui/pagination';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ['blogs', currentPage, pageSize],
    queryFn: async () => {
      const startIndex = (currentPage - 1) * pageSize;
      
      // Get only AI-generated blogs (not CVE entries), filtered by not having CVE in the title
      const { data, error, count } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact' })
        .not('title', 'ilike', 'CVE-%') 
        .not('severity', 'is', null)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
        
      if (error) throw error;
      return { data: data || [], count: count || 0 };
    },
  });

  const totalPages = blogs?.count ? Math.ceil(blogs.count / pageSize) : 0;

  const handleBlogClick = (id: string) => {
    navigate(`/blog/${id}`);
  };
  
  const handleRefresh = () => {
    refetch();
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        // Show ellipsis if current page is far from start
        pages.push(-1);
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        // Show ellipsis if current page is far from end
        pages.push(-2);
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Security Blog</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Show skeletons while loading
          Array(6).fill(0).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))
        ) : blogs?.data && blogs.data.length > 0 ? (
          blogs.data.map(blog => (
            <VulnerabilityCard
              key={blog.id}
              cveId={blog.title}
              title={blog.title}
              description={blog.description || "No details available"}
              severity={blog.severity as 'critical' | 'high' | 'medium' | 'low'}
              cvssScore={0}
              publishedDate={blog.created_at}
              affectedProducts={[]}
              onClick={() => handleBlogClick(blog.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 border rounded-lg bg-muted/30">
            <p className="text-xl font-medium text-muted-foreground mb-4">No blog posts found</p>
            <p className="text-muted-foreground mb-6">The database has been cleared or no blog posts have been created yet.</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="mx-auto">
              Go to Admin
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="my-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              page < 0 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BlogList;
