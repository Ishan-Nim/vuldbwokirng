
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
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
  return new Intl.DateTimeFormat('ja-JP', {
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
        setError("ブログデータの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleBack = () => navigate('/blog');

  if (loading) return <BlogDetailSkeleton />;
  
  if (error || !vulnerability) {
    return (
      <MainLayout>
        <div className="py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="text-destructive mr-2 h-5 w-5" />
                エラーが発生しました
              </CardTitle>
              <CardDescription>
                {error || "ブログ記事が見つかりませんでした。"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBack} variant="outline" size="sm" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> ブログ一覧に戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6 space-y-6">
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
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
                  <CardTitle>脅威モデリング</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">悪用可能性</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.exploitability ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">普及度</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.prevalence ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">検出難易度</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.detectability ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">技術的影響</h3>
                      <div className="flex space-x-1">
                        {Array(3).fill(0).map((_, i) => (
                          <span key={i} className={`w-4 h-4 rounded-full ${i < threatModeling.technical_impact_score ? 'bg-destructive' : 'bg-muted'}`}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-2">ビジネスへの影響詳細</h3>
                    <p>{threatModeling.business_impact_detail}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Remediation Tab - Improved readability */}
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
                    {remediations.map((remediation, index) => (
                      <div key={remediation.id} className={index > 0 ? "pt-6 border-t" : ""}>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-lg">{index + 1}. {remediation.recommendation}</h3>
                          <Badge variant={
                            remediation.priority_level === "必須" ? "destructive" : 
                            remediation.priority_level === "推奨" ? "default" : "outline"
                          } className="ml-2">
                            {remediation.priority_level === "必須" ? "Critical" : 
                             remediation.priority_level === "推奨" ? "Recommended" : 
                             "Optional"}
                          </Badge>
                        </div>
                        <div className="pl-5 pr-2 py-2 bg-muted/50 rounded-md">
                          <p className="text-sm leading-6">{remediation.recommendation}</p>
                        </div>
                      </div>
                    ))}
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
    </MainLayout>
  );
};

export default Blog;
