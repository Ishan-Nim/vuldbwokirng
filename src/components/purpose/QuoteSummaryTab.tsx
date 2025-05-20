
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
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
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">サービス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種類</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">基本料金 (万円)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedServices.web && serviceConfig.web && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Webセキュリティテスト</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.web as WebServiceConfig).type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.web as WebServiceConfig).price}</td>
                  </tr>
                )}
                
                {selectedServices.cloud && serviceConfig.cloud && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">クラウド評価</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.cloud as CloudServiceConfig).type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.cloud as CloudServiceConfig).price}</td>
                  </tr>
                )}
                
                {selectedServices.network && serviceConfig.network && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">ネットワーク侵入テスト</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.network as NetworkServiceConfig).type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.network as NetworkServiceConfig).price}</td>
                  </tr>
                )}
                
                {selectedServices.mobile && serviceConfig.mobile && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">モバイルアプリテスト</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(serviceConfig.mobile as MobileServiceConfig).type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{(serviceConfig.mobile as MobileServiceConfig).price}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>小計</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    {Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                      if (selectedServices[service as ServiceType] && config) {
                        return acc + ((config as any).price || 0);
                      }
                      return acc;
                    }, 0)}
                  </th>
                </tr>
                {companyProfile?.isJapaneseListed && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold" colSpan={2}>日本の上場企業プレミアム (+12%)</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      +{Math.round(Object.entries(serviceConfig).reduce((acc, [service, config]) => {
                        if (selectedServices[service as ServiceType] && config) {
                          return acc + ((config as any).price || 0);
                        }
                        return acc;
                      }, 0) * 0.12)}
                    </th>
                  </tr>
                )}
                <tr className="bg-primary/5">
                  <th className="px-6 py-4 text-left text-base font-bold" colSpan={2}>合計見積額</th>
                  <th className="px-6 py-4 text-right text-base font-bold">
                    {calculateTotal()} 万円
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          
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
