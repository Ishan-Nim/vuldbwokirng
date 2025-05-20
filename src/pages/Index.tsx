
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

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Show 20 vulnerabilities per page

  const { data: vulnerabilities, isLoading } = useQuery({
    queryKey: ['vulnerabilities', currentPage, pageSize],
    queryFn: async () => {
      const startIndex = (currentPage - 1) * pageSize;
      
      // Get vulnerabilities with pagination
      const { data, error, count } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
        
      if (error) throw error;
      return { data: data || [], count };
    },
  });

  const totalPages = vulnerabilities?.count ? Math.ceil(vulnerabilities.count / pageSize) : 0;

  const handleVulnerabilityClick = (id: string) => {
    // For blog posts (those without CVE in title), navigate to blog detail
    const vulnerability = vulnerabilities?.data.find(v => v.id === id);
    if (vulnerability && !vulnerability.title.match(/CVE-\d{4}-\d+/)) {
      navigate(`/blog/${id}`);
    } else {
      // Show detail modal for CVEs (handled by parent component)
    }
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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">最新の脆弱性情報</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Show skeletons while loading
          Array(6).fill(0).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))
        ) : vulnerabilities?.data && vulnerabilities.data.length > 0 ? (
          vulnerabilities.data.map(vuln => {
            // Extract CVE ID from title if available
            const cveIdMatch = vuln.title.match(/CVE-\d{4}-\d+/);
            const cveId = cveIdMatch ? cveIdMatch[0] : '';
            
            // Get affected products if any
            const affectedProducts = [];
            if (vuln.title.includes('WordPress')) affectedProducts.push('WordPress');
            if (vuln.title.includes('Apache')) affectedProducts.push('Apache');
            if (vuln.title.includes('Microsoft')) affectedProducts.push('Microsoft');
            if (vuln.title.includes('Linux')) affectedProducts.push('Linux');
            if (vuln.title.includes('iOS')) affectedProducts.push('iOS');
            if (vuln.title.includes('Android')) affectedProducts.push('Android');
            
            return (
              <VulnerabilityCard
                key={vuln.id}
                cveId={cveId || vuln.title}
                title={vuln.title}
                description={vuln.description || "詳細はありません"}
                severity={vuln.severity as 'critical' | 'high' | 'medium' | 'low' || 'low'}
                cvssScore={0}
                publishedDate={vuln.created_at}
                affectedProducts={affectedProducts}
                exploitStatus={vuln.risk_rating}
                onClick={() => handleVulnerabilityClick(vuln.id)}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p>脆弱性情報はありません。</p>
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

export default Index;
