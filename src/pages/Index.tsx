
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
  
  // Fetch AI-enriched vulnerabilities from the database
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
          
          // Generate a CVSS score based on severity
          const cvssScore = 
            vuln.severity === 'critical' ? 9.5 :
            vuln.severity === 'high' ? 7.5 :
            vuln.severity === 'medium' ? 5.0 : 3.0;
            
          // Generate affected systems as products
          const affectedProducts = generateAffectedProducts(vuln);
          
          // Generate exploit status based on risk rating
          const exploitStatus = generateExploitStatus(vuln.risk_rating);
          
          // Generate related CVEs (simulated)
          const relatedCVEs = generateRelatedCVEs(cveId, vuln.title);
          
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
            mitigationStrategies: generateMitigationStrategies(vuln.severity),
            relatedCVEs: relatedCVEs
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

  // Helper function to generate affected products
  const generateAffectedProducts = (vuln) => {
    // Extract potential product names from title and business_impact
    const titleWords = vuln.title.split(' ');
    const productWords = titleWords.filter(w => w.length > 3 && /^[A-Z]/.test(w));
    
    let products = [];
    
    // Add product from title if it exists
    if (productWords.length > 0) {
      products.push(productWords[0]);
    }
    
    // Add product from business impact if available
    if (vuln.business_impact) {
      const impactSentences = vuln.business_impact.split('.');
      if (impactSentences.length > 0) {
        const words = impactSentences[0].split(' ');
        const potentialProduct = words.find(w => w.length > 3 && /^[A-Z]/.test(w));
        if (potentialProduct && !products.includes(potentialProduct)) {
          products.push(potentialProduct);
        }
      }
    }
    
    // Generate more affected products based on vulnerability type
    if (vuln.title.toLowerCase().includes('sql')) {
      products.push('Database Systems');
    }
    
    if (vuln.title.toLowerCase().includes('xss') || vuln.title.toLowerCase().includes('cross-site')) {
      products.push('Web Applications');
    }
    
    if (vuln.title.toLowerCase().includes('remote')) {
      products.push('Network Services');
    }
    
    // Ensure we have at least some default values if nothing was detected
    if (products.length === 0) {
      products = ['Affected System'];
    }
    
    return [...new Set(products)]; // Remove duplicates
  };

  // Helper function to generate exploit status
  const generateExploitStatus = (riskRating) => {
    if (!riskRating) return 'No Known Exploits';
    
    switch (riskRating.toLowerCase()) {
      case 'critical':
        return 'Actively Exploited';
      case 'high':
        return 'Exploit Available';
      case 'medium':
        return 'Proof of Concept';
      default:
        return 'No Known Exploits';
    }
  };

  // Helper function to generate related CVEs (simulated)
  const generateRelatedCVEs = (cveId, title) => {
    if (!cveId.match(/CVE-\d{4}-\d+/)) return [];
    
    const year = cveId.match(/\d{4}/)[0];
    const keywords = title.toLowerCase().split(' ');
    
    // Only generate related CVEs for certain vulnerability types
    if (keywords.some(k => ['sql', 'injection', 'xss', 'overflow', 'execution'].includes(k))) {
      const cveNumber = parseInt(cveId.split('-')[2]);
      const relatedIds = [
        `CVE-${year}-${cveNumber + 1}`, 
        `CVE-${year}-${cveNumber - 1}`
      ];
      return relatedIds;
    }
    
    return [];
  };

  // Helper function to generate mitigation strategies
  const generateMitigationStrategies = (severity) => {
    const commonStrategy = "Update to the latest version and follow vendor recommendations.";
    
    if (!severity) return commonStrategy;
    
    switch (severity.toLowerCase()) {
      case 'critical':
        return "Immediately patch affected systems or isolate them until a patch is applied. Implement additional network security controls and monitor for suspicious activity." + 
               " Update to the latest version as soon as possible.";
      case 'high':
        return "Apply security patches promptly and review system configurations for additional hardening opportunities." +
               " Update to the latest version and implement recommended security controls.";
      case 'medium':
        return "Apply updates according to your patch management policy and review system access controls." +
               " Update to the latest version during your next maintenance window.";
      default:
        return commonStrategy;
    }
  };

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
            CVE RSS Enriched Vulnerability Feed
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            AI-analyzed CVE entries with comprehensive impact assessment
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
                Displaying <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalCount}</span> AI-enriched CVE entries
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
                    exploitStatus={vuln.exploitStatus}
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
