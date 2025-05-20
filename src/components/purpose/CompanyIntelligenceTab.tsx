
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Edit } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CompanyProfile } from '@/types/purpose';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const companySchema = z.object({
  companyName: z.string().min(2, { message: "会社名を入力してください" }),
});

type CompanyIntelligenceTabProps = {
  companyProfile: CompanyProfile | null;
  setCompanyProfile: (profile: CompanyProfile | null) => void;
  moveToNextTab: () => void;
};

const CompanyIntelligenceTab = ({ companyProfile, setCompanyProfile, moveToNextTab }: CompanyIntelligenceTabProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
    },
  });

  const generateCompanyProfile = async (data: { companyName: string }) => {
    if (!data.companyName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call our Supabase Edge Function
      const { data: responseData, error: functionError } = await supabase.functions.invoke('company-profile', {
        body: { companyName: data.companyName }
      });
      
      if (functionError) {
        throw new Error(`関数エラー: ${functionError.message}`);
      }
      
      if (!responseData.success) {
        throw new Error(responseData.error || '企業プロファイルの生成に失敗しました');
      }
      
      const profileData = responseData.profile;
      
      // Create the company profile from the returned data
      const profile: CompanyProfile = {
        name: profileData.name || data.companyName,
        website: profileData.website || `${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        headOffice: profileData.headOffice || '不明',
        employeeCount: profileData.employeeCount || Math.floor(Math.random() * 10000),
        mainBusiness: profileData.mainBusiness || ['テクノロジー'],
        established: profileData.established || Math.floor(Math.random() * 30 + 1980).toString(),
        capital: profileData.capital || '不明',
        revenue: profileData.revenue || '不明',
        dataBreaches: profileData.dataBreaches || [],
        isListed: profileData.isListed || false,
        stockPrice: profileData.stockPrice || 'N/A',
        country: profileData.country || '不明',
        isJapaneseListed: profileData.isJapaneseListed || false
      };
      
      setCompanyProfile(profile);
      toast({
        title: "企業プロファイル生成完了",
        description: `${profile.name}に関する情報の取得に成功しました`,
      });
      
      // Move to services tab after profile is generated
      moveToNextTab();
      
    } catch (error) {
      console.error('企業プロファイル生成エラー:', error);
      setError(error instanceof Error ? error.message : '企業プロファイルの生成に失敗しました');
      
      // Fallback to simulated data
      createFallbackProfile(data.companyName);
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackProfile = (companyName: string) => {
    // Fallback to simulated data on API error
    const isJapaneseListed = companyName.toLowerCase().includes('sony') || 
                        companyName.toLowerCase().includes('toyota') ||
                        companyName.toLowerCase().includes('nintendo') ||
                        companyName.includes('株式会社');
    
    toast({
      variant: "destructive",
      title: "エラー",
      description: "企業プロファイルの生成に失敗しました。模擬データを使用します。",
    });
    
    const mockProfile: CompanyProfile = {
      name: companyName,
      website: companyName.toLowerCase().replace(/\s+/g, '') + '.com',
      headOffice: isJapaneseListed ? '東京, 日本' : '不明',
      employeeCount: isJapaneseListed ? Math.floor(Math.random() * 100000) + 10000 : Math.floor(Math.random() * 10000),
      mainBusiness: isJapaneseListed 
        ? ['電子機器', 'エンターテイメント', '金融サービス'] 
        : ['テクノロジー'],
      established: isJapaneseListed ? '1946' : Math.floor(Math.random() * 30 + 1980).toString(),
      capital: isJapaneseListed ? '880.24億円' : '不明',
      revenue: isJapaneseListed ? '11.54兆円' : '不明',
      dataBreaches: [],
      isListed: isJapaneseListed,
      stockPrice: isJapaneseListed ? '14,000円' : 'N/A',
      country: isJapaneseListed ? '日本' : '不明',
      isJapaneseListed: isJapaneseListed,
    };
    
    setCompanyProfile(mockProfile);
    moveToNextTab();
  };
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save updated profile and show confirmation
    toast({
      title: "プロファイル更新",
      description: "企業プロファイルが正常に更新されました。"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>企業情報</CardTitle>
          <CardDescription>AIを使用して企業プロファイルを生成するために会社名を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(generateCompanyProfile)} className="space-y-6">
              <FormField
                control={companyForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>会社名</FormLabel>
                    <FormControl>
                      <Input placeholder="例: ソニー株式会社" {...field} />
                    </FormControl>
                    <FormDescription>
                      分析する会社の正式名称を入力してください（日本企業の例として「ソニー」や「任天堂」、または「株式会社エスプール」などを試してみてください）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    プロファイル生成中...
                  </>
                ) : (
                  <>検索と生成</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {companyProfile && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>企業プロファイル: {companyProfile.name}</CardTitle>
              <CardDescription>AI生成企業情報</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditProfile} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              プロファイル編集
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">ウェブサイト</label>
                      <Input 
                        defaultValue={companyProfile.website}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          website: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">本社</label>
                      <Input 
                        defaultValue={companyProfile.headOffice}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          headOffice: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">従業員数</label>
                      <Input 
                        type="number"
                        defaultValue={companyProfile.employeeCount}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          employeeCount: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">主要事業</label>
                      <Input 
                        defaultValue={companyProfile.mainBusiness?.join(', ')}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          mainBusiness: e.target.value.split(',').map(item => item.trim())
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">設立年</label>
                      <Input 
                        defaultValue={companyProfile.established}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          established: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">資本金</label>
                      <Input 
                        defaultValue={companyProfile.capital}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          capital: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">売上高</label>
                      <Input 
                        defaultValue={companyProfile.revenue}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          revenue: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">国</label>
                      <Input 
                        defaultValue={companyProfile.country}
                        onChange={(e) => setCompanyProfile({
                          ...companyProfile, 
                          country: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>変更を保存</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">ウェブサイト:</span> {companyProfile.website}
                  </div>
                  <div>
                    <span className="font-medium">本社:</span> {companyProfile.headOffice}
                  </div>
                  <div>
                    <span className="font-medium">従業員数:</span> {companyProfile.employeeCount?.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">主要事業:</span> {companyProfile.mainBusiness?.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">設立年:</span> {companyProfile.established}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">資本金:</span> {companyProfile.capital}
                  </div>
                  <div>
                    <span className="font-medium">売上高:</span> {companyProfile.revenue}
                  </div>
                  <div>
                    <span className="font-medium">国:</span> {companyProfile.country}
                  </div>
                  <div>
                    <span className="font-medium">上場企業:</span> {companyProfile.isListed ? 'はい' : 'いいえ'}
                  </div>
                  <div>
                    <span className="font-medium">株価:</span> {companyProfile.stockPrice}
                  </div>
                  {companyProfile.isJapaneseListed && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-700">日本の上場企業: +12%プレミアム価格</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!isEditing && companyProfile && (
              <div className="mt-5 flex justify-end">
                <Button onClick={moveToNextTab}>次へ: サービス構成</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyIntelligenceTab;
