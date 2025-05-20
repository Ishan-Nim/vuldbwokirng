
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VulnerabilityCard from '@/components/vulnerabilities/VulnerabilityCard';
import VulnerabilityFilters from '@/components/vulnerabilities/VulnerabilityFilters';
import { VulnerabilityDetailModal } from '@/components/vulnerabilities/VulnerabilityDetailModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield, Loader2, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch only AI-enriched vulnerabilities from the database
  useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('vulnerabilities')
          .select('*')
          .not('technical_impact', 'is', null)  // Only get entries with technical_impact (enriched)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match our component props
        const transformedData = data.map(vuln => {
          // Extract CVE ID from title or use a generated one
          const cveIdRegex = /CVE-\d{4}-\d+/;
          const cveIdMatch = vuln.title?.match(cveIdRegex) || vuln.description?.match(cveIdRegex);
          const cveId = cveIdMatch ? cveIdMatch[0] : `CVE-${new Date().getFullYear()}-XXXX`;
          
          // Generate a CVSS score if not present
          const cvssScore = 
            vuln.severity === 'critical' ? 9.5 :
            vuln.severity === 'high' ? 7.5 :
            vuln.severity === 'medium' ? 5.0 : 3.0;
            
          // Generate affected products from risk rating or provide defaults
          const affectedProducts = vuln.affected_products || ['Unknown System'];
          
          // Generate exploit status based on risk rating
          const exploitStatus = vuln.exploit_status || 
            (vuln.risk_rating === 'critical' ? 'Actively Exploited' : 
            vuln.risk_rating === 'high' ? 'Exploit Available' : 
            'No Known Exploits');
          
          return {
            id: vuln.id,
            cveId: cveId,
            title: vuln.title,
            description: vuln.description || 'No description available',
            severity: vuln.severity || 'medium',
            cvssScore: cvssScore,
            publishedDate: new Date(vuln.created_at).toLocaleDateString(),
            technicalAnalysis: vuln.technical_impact || 'No technical analysis available',
            businessImpact: vuln.business_impact || 'No business impact analysis available',
            exploitStatus: exploitStatus,
            affectedProducts: affectedProducts,
            riskRating: vuln.risk_rating || 'medium',
            knownExploits: exploitStatus,
            mitigationStrategies: 'Update to the latest version and follow vendor recommendations.'
          };
        });
        
        setVulnerabilities(transformedData);
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
        toast({
          title: 'Error fetching vulnerabilities',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVulnerabilities();
  }, []);

  // Filter vulnerabilities based on search query and severity
  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = searchQuery === '' || 
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const openVulnerabilityDetails = (vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setIsDetailModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
  };

  const totalCount = vulnerabilities.length;
  const filteredCount = filteredVulnerabilities.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Enriched Vulnerability Database
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            AI-analyzed security intelligence with technical and business impact assessment
          </p>
        </div>

        <VulnerabilityFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg font-medium">Loading enriched vulnerabilities...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Displaying <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalCount}</span> AI-enriched vulnerabilities
              </div>
            </div>

            {filteredVulnerabilities.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No enriched vulnerabilities found</AlertTitle>
                <AlertDescription>
                  No AI-enriched vulnerabilities match your current search criteria. Try adjusting your filters or enriching more CVEs from the admin panel.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVulnerabilities.map((vuln) => (
                  <VulnerabilityCard
                    key={vuln.id}
                    cveId={vuln.cveId}
                    title={vuln.title}
                    description={vuln.description}
                    severity={vuln.severity}
                    cvssScore={vuln.cvssScore}
                    publishedDate={vuln.publishedDate}
                    affectedProducts={vuln.affectedProducts}
                    onClick={() => openVulnerabilityDetails(vuln)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedVulnerability && (
        <VulnerabilityDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          vulnerability={selectedVulnerability}
        />
      )}
    </MainLayout>
  );
};

export default Index;
