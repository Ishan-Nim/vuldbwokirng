
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

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: blogs, isLoading } = useQuery({
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
      return { data: data || [], count };
    },
  });

  const totalPages = blogs?.count ? Math.ceil(blogs.count / pageSize) : 0;

  const handleBlogClick = (id: string) => {
    navigate(`/blog/${id}`);
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
      <h1 className="text-3xl font-bold mb-6">セキュリティブログ</h1>
      
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
              description={blog.description || "詳細はありません"}
              severity={blog.severity as 'critical' | 'high' | 'medium' | 'low'}
              cvssScore={0}
              publishedDate={blog.created_at}
              affectedProducts={[]}
              onClick={() => handleBlogClick(blog.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>ブログ記事がありません。</p>
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
