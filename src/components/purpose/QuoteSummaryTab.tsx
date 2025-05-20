
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServiceType, ServiceConfig, CompanyProfile, WebServiceConfig, CloudServiceConfig, NetworkServiceConfig, MobileServiceConfig } from '@/types/purpose';

type QuoteSummaryTabProps = {
  companyProfile: CompanyProfile | null;
  serviceConfig: ServiceConfig;
  selectedServices: Record<ServiceType, boolean>;
};

const QuoteSummaryTab = ({ companyProfile, serviceConfig, selectedServices }: QuoteSummaryTabProps) => {
  const { toast } = useToast();
  
  const calculateTotal = () => {
    let total = 0;
    
    Object.entries(serviceConfig).forEach(([service, config]) => {
      if (selectedServices[service as ServiceType] && config) {
        total += (config as any).price || 0;
      }
    });
    
    // Apply Japanese listed company premium if applicable
    if (companyProfile?.isJapaneseListed) {
      total = Math.round(total * 1.12); // 12% increase
    }
    
    return total;
  };
  
  const downloadPdf = () => {
    toast({
      title: "PDF ダウンロード開始",
      description: "見積書のPDFを生成中です。まもなくダウンロードが始まります。",
    });
  };
  
  const saveQuote = () => {
    toast({
      title: "見積書保存完了",
      description: "見積書がアカウントに保存されました。",
    });
  };
  
  // Function to render service details
  const renderServiceDetails = (serviceType: ServiceType) => {
    if (!selectedServices[serviceType] || !serviceConfig[serviceType]) return null;
    
    const config = serviceConfig[serviceType];
    
    switch (serviceType) {
      case 'web':
        const webConfig = config as WebServiceConfig;
        return (
          <>
            <TableRow>
              <TableCell colSpan={3} className="font-medium bg-muted/30">
                Webセキュリティテスト詳細
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">開発タイプ</TableCell>
              <TableCell colSpan={2}>{webConfig.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">ページ数</TableCell>
              <TableCell colSpan={2}>{webConfig.pages}ページ</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">ログイン複雑性</TableCell>
              <TableCell colSpan={2}>{webConfig.loginComplexity}</TableCell>
            </TableRow>
            {webConfig.technologies && webConfig.technologies.length > 0 && (
              <TableRow>
                <TableCell className="pl-8">使用技術</TableCell>
                <TableCell colSpan={2}>{webConfig.technologies.join(', ')}</TableCell>
              </TableRow>
            )}
            {webConfig.apiRequirements && (
              <TableRow>
                <TableCell className="pl-8">API要件</TableCell>
                <TableCell colSpan={2}>{webConfig.apiRequirements}</TableCell>
              </TableRow>
            )}
            {webConfig.cmsIntegration && (
              <TableRow>
                <TableCell className="pl-8">CMS統合</TableCell>
                <TableCell colSpan={2}>{webConfig.cmsType || 'あり'}</TableCell>
              </TableRow>
            )}
          </>
        );
        
      case 'cloud':
        const cloudConfig = config as CloudServiceConfig;
        return (
          <>
            <TableRow>
              <TableCell colSpan={3} className="font-medium bg-muted/30">
                クラウド評価詳細
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">アカウント数</TableCell>
              <TableCell colSpan={2}>{cloudConfig.accounts}アカウント</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">プロバイダー</TableCell>
              <TableCell colSpan={2}>{cloudConfig.providers?.join(', ') || '未指定'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">地域</TableCell>
              <TableCell colSpan={2}>{cloudConfig.regions?.join(', ') || '未指定'}</TableCell>
            </TableRow>
            {cloudConfig.compliance && cloudConfig.compliance.length > 0 && (
              <TableRow>
                <TableCell className="pl-8">コンプライアンス</TableCell>
                <TableCell colSpan={2}>{cloudConfig.compliance.join(', ')}</TableCell>
              </TableRow>
            )}
          </>
        );
        
      case 'network':
        const networkConfig = config as NetworkServiceConfig;
        return (
          <>
            <TableRow>
              <TableCell colSpan={3} className="font-medium bg-muted/30">
                ネットワーク侵入テスト詳細
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">モード</TableCell>
              <TableCell colSpan={2}>{networkConfig.mode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">IPアドレス数</TableCell>
              <TableCell colSpan={2}>{networkConfig.ipCount}個</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">VPN要件</TableCell>
              <TableCell colSpan={2}>{networkConfig.vpnRequired ? '必要' : '不要'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">ファイアウォール</TableCell>
              <TableCell colSpan={2}>
                {networkConfig.firewall ? `あり (${networkConfig.firewallType || '標準'})` : '不要'}
              </TableCell>
            </TableRow>
          </>
        );
        
      case 'mobile':
        const mobileConfig = config as MobileServiceConfig;
        return (
          <>
            <TableRow>
              <TableCell colSpan={3} className="font-medium bg-muted/30">
                モバイルアプリテスト詳細
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">アプリ数</TableCell>
              <TableCell colSpan={2}>{mobileConfig.count}個</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">プラットフォーム</TableCell>
              <TableCell colSpan={2}>{mobileConfig.platforms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">開発タイプ</TableCell>
              <TableCell colSpan={2}>{mobileConfig.developmentType || '未指定'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">認証方法</TableCell>
              <TableCell colSpan={2}>{mobileConfig.authentication || '未指定'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">バックエンド統合</TableCell>
              <TableCell colSpan={2}>{mobileConfig.backendIntegration ? 'あり' : 'なし'}</TableCell>
            </TableRow>
          </>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>見積書の概要</CardTitle>
        <CardDescription>
          選択されたセキュリティサービスの見積価格
          {companyProfile?.isJapaneseListed && " (日本の上場企業向け+12%プレミアム含む)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>サービス</TableHead>
                <TableHead>種類</TableHead>
                <TableHead className="text-right">基本料金 (万円)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedServices.web && serviceConfig.web && (
                <TableRow>
                  <TableCell className="font-medium">Webセキュリティテスト</TableCell>
                  <TableCell>{(serviceConfig.web as WebServiceConfig).type}</TableCell>
                  <TableCell className="text-right">{(serviceConfig.web as WebServiceConfig).price}</TableCell>
                </TableRow>
              )}
              {selectedServices.web && serviceConfig.web && renderServiceDetails('web')}
              
              {selectedServices.cloud && serviceConfig.cloud && (
                <TableRow>
                  <TableCell className="font-medium">クラウド評価</TableCell>
                  <TableCell>{(serviceConfig.cloud as CloudServiceConfig).type}</TableCell>
                  <TableCell className="text-right">{(serviceConfig.cloud as CloudServiceConfig).price}</TableCell>
                </TableRow>
              )}
              {selectedServices.cloud && serviceConfig.cloud && renderServiceDetails('cloud')}
              
              {selectedServices.network && serviceConfig.network && (
                <TableRow>
                  <TableCell className="font-medium">ネットワーク侵入テスト</TableCell>
                  <TableCell>{(serviceConfig.network as NetworkServiceConfig).type}</TableCell>
                  <TableCell className="text-right">{(serviceConfig.network as NetworkServiceConfig).price}</TableCell>
                </TableRow>
              )}
              {selectedServices.network && serviceConfig.network && renderServiceDetails('network')}
              
              {selectedServices.mobile && serviceConfig.mobile && (
                <TableRow>
                  <TableCell className="font-medium">モバイルアプリテスト</TableCell>
                  <TableCell>{(serviceConfig.mobile as MobileServiceConfig).type}</TableCell>
                  <TableCell className="text-right">{(serviceConfig.mobile as MobileServiceConfig).price}</TableCell>
                </TableRow>
              )}
              {selectedServices.mobile && serviceConfig.mobile && renderServiceDetails('mobile')}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>小計</TableCell>
                <TableCell className="text-right">
                  {Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                    if (selectedServices[service as ServiceType] && config) {
                      return acc + ((config as any).price || 0);
                    }
                    return acc;
                  }, 0)}
                </TableCell>
              </TableRow>
              {companyProfile?.isJapaneseListed && (
                <TableRow>
                  <TableCell colSpan={2}>日本の上場企業プレミアム (+12%)</TableCell>
                  <TableCell className="text-right">
                    +{Math.round(Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                      if (selectedServices[service as ServiceType] && config) {
                        return acc + ((config as any).price || 0);
                      }
                      return acc;
                    }, 0) * 0.12)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">合計見積額</TableCell>
                <TableCell className="text-right font-bold">
                  {calculateTotal()} 万円
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          
          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button variant="outline" onClick={saveQuote}>
              見積書保存
            </Button>
            <Button onClick={downloadPdf}>
              PDF ダウンロード
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteSummaryTab;
