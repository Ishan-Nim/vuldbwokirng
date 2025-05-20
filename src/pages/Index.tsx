
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VulnerabilityCard from '@/components/vulnerabilities/VulnerabilityCard';
import { supabase } from '@/integrations/supabase/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import VulnerabilityFilters from '@/components/vulnerabilities/VulnerabilityFilters';
import { Skeleton } from '@/components/ui/skeleton';

interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss_score?: number;
  published_date?: string;
  affected_products?: string[];
  exploit_status?: string;
  created_at: string;
}

const POSTS_PER_PAGE = 20;

const IndexPage = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: [] as string[],
    exploitStatus: [] as string[],
    searchQuery: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVulnerabilities();
  }, [filters, currentPage]);

  const fetchVulnerabilities = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.severity.length > 0) {
        query = query.in('severity', filters.severity);
      }

      if (filters.exploitStatus.length > 0) {
        query = query.in('exploit_status', filters.exploitStatus);
      }

      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      
      const { data, count, error } = await query.range(from, to);

      if (error) {
        throw error;
      }

      if (data) {
        setVulnerabilities(data);
        if (count) {
          setTotalPages(Math.ceil(count / POSTS_PER_PAGE));
        }
      }
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleViewVulnerability = (id: string) => {
    // Navigate to vulnerability detail page
    window.location.href = `/vulnerabilities/${id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Generate pagination numbers
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (end - start + 1 < maxPagesToShow - 2) {
        if (start === 2) {
          end = Math.min(start + (maxPagesToShow - 3), totalPages - 1);
        } else if (end === totalPages - 1) {
          start = Math.max(end - (maxPagesToShow - 3), 2);
        }
      }
      
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vulnerability Database</h1>
          <p className="text-muted-foreground mt-1">
            Browse the latest security vulnerabilities and CVEs
          </p>
        </div>

        <VulnerabilityFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {vulnerabilities.length > 0 ? (
                vulnerabilities.map((vulnerability) => (
                  <VulnerabilityCard
                    key={vulnerability.id}
                    cveId={vulnerability.title.match(/CVE-\d{4}-\d+/)?.[0] || 'N/A'}
                    title={vulnerability.title}
                    description={vulnerability.description || 'No description available'}
                    severity={vulnerability.severity || 'low'}
                    cvssScore={vulnerability.cvss_score || 0}
                    publishedDate={vulnerability.published_date || new Date(vulnerability.created_at).toLocaleDateString()}
                    affectedProducts={vulnerability.affected_products || []}
                    exploitStatus={vulnerability.exploit_status}
                    onClick={() => handleViewVulnerability(vulnerability.id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No vulnerabilities found matching your criteria</p>
                </div>
              )}
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
                      {pageNum === '...' ? (
                        <span className="px-4 py-2">...</span>
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum as number);
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

export default IndexPage;
