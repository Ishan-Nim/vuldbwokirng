
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VulnerabilityCard from '@/components/vulnerabilities/VulnerabilityCard';
import VulnerabilityFilters from '@/components/vulnerabilities/VulnerabilityFilters';
import { VulnerabilityDetailModal } from '@/components/vulnerabilities/VulnerabilityDetailModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';

// Mock data for demonstration
const mockVulnerabilities = [
  {
    id: 1,
    cveId: 'CVE-2025-4866',
    title: 'Webocom Rill-Flow Management Console Code Injection Vulnerability',
    description: 'A vulnerability was found in webocom rill-flow 0.1.18. It has been classified as critical and allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation.',
    severity: 'critical' as const,
    cvssScore: 9.8,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the management console. The attack vector is through the web interface accessible over HTTP/HTTPS.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
    relatedCVEs: ['CVE-2023-1234', 'CVE-2022-5678']
  },
  {
    id: 2,
    cveId: 'CVE-2025-4870',
    title: 'iSourcecode Restaurant Management System SQL Injection Vulnerability',
    description: 'A vulnerability classified as critical was found in iSourcecode Restaurant Management System 1.0. This vulnerability affects unknown code of the file /admin/menu_save.php. The manipulation of the argument menu leads to sql injection.',
    severity: 'high' as const,
    cvssScore: 7.8,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the menu_save.php file. The vulnerability affects unknown code in the admin interface.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
    relatedCVEs: ['CVE-2023-1234', 'CVE-2022-5678']
  },
  {
    id: 3,
    cveId: 'CVE-2025-4871',
    title: 'PCMan FTP Server Buffer Overflow Vulnerability',
    description: 'A vulnerability, which was classified as critical, has been found in PCMan FTP Server 2.0.7. This affects an unknown part of the file PCMan FTP Server 2.0.7. The manipulation leads to buffer overflow.',
    severity: 'high' as const,
    cvssScore: 8.8,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the PCMan FTP Server. The vulnerability affects an unknown part of the server functionality.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
  },
  {
    id: 4,
    cveId: 'CVE-2025-4859',
    title: 'D-Link DAP-2695 Cross-Site Scripting in MAC Bypass Settings Page',
    description: 'A vulnerability was found in D-Link DAP-2695 1.20b36r137_ALL_en_20210528. It has been declared as problematic. This vulnerability affects the function MAC Bypass Settings of the file /login/eng_login_redirect_2_ok.php.',
    severity: 'critical' as const,
    cvssScore: 10.0,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the MAC Bypass Settings page. The vulnerability affects the function of the file /login/eng_login_redirect_2_ok.php.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
  },
  {
    id: 5,
    cveId: 'CVE-2025-4862',
    title: 'PHPGurukul Directory Management System Cross Site Scripting Vulnerability',
    description: 'A vulnerability, which was classified as problematic, has been found in PHPGurukul Directory Management System 1.0. This affects an unknown part of the component Search Box.',
    severity: 'high' as const,
    cvssScore: 7.8,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the Search Box component. The vulnerability affects an unknown part of the component.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
  },
  {
    id: 6,
    cveId: 'CVE-2025-4850',
    title: 'TOTOLINK N300RH Command Injection Vulnerability',
    description: 'A vulnerability classified as critical has been found in TOTOLINK N300RH. Affected is an unknown function of the component Web Shell Command Handler.',
    severity: 'medium' as const,
    cvssScore: 6.8,
    publishedDate: 'May 18, 2025',
    technicalAnalysis: 'This vulnerability allows remote attackers to execute arbitrary code via a crafted HTTP request, related to improper input validation in the Web Shell Command Handler component. The vulnerability affects an unknown function of the component.',
    businessImpact: 'Critical business systems may be compromised, potentially leading to data breaches, service disruption, and regulatory compliance issues.',
    knownExploits: 'Proof-of-concept exploit code is available on GitHub. Active exploitation observed in the wild targeting financial institutions.',
    mitigationStrategies: 'Update to the latest version immediately. Apply network filtering to block suspicious requests. Enable enhanced logging and monitoring for suspicious activities.',
    affectedProducts: ['Apache Server 2.4.x', 'Windows 10', 'Ubuntu 20.04 LTS'],
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedVulnerability, setSelectedVulnerability] = useState<typeof mockVulnerabilities[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter vulnerabilities based on search query and severity
  const filteredVulnerabilities = mockVulnerabilities.filter(vuln => {
    const matchesSearch = searchQuery === '' || 
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const openVulnerabilityDetails = (vulnerability: typeof mockVulnerabilities[0]) => {
    setSelectedVulnerability(vulnerability);
    setIsDetailModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
  };

  const totalCount = mockVulnerabilities.length;
  const filteredCount = filteredVulnerabilities.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Vulnerability Database
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered security intelligence for the latest CVEs and vulnerabilities
          </p>
        </div>

        <VulnerabilityFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          onClearFilters={handleClearFilters}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Displaying <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalCount}</span> vulnerabilities
          </div>
        </div>

        {filteredVulnerabilities.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No results found</AlertTitle>
            <AlertDescription>
              No vulnerabilities match your current search criteria. Try adjusting your filters.
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
