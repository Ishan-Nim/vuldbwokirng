
// Helper function to generate blogs
async function generateBlogs(topics: string[], supabase: any): Promise<number> {
  let count = 0;
  
  for (const title of topics) {
    try {
      // Call the generate-japanese-blog function for each title
      const response = await supabase.functions.invoke('generate-japanese-blog', {
        body: { title }
      });
      
      if (response.error) {
        console.error(`Error generating blog for "${title}": ${response.error.message}`);
        continue;
      }
      
      count++;
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to generate blog for "${title}":`, error);
    }
  }
  
  return count;
}

export async function handleBlogGenTask(supabase: any, updateScheduleRecord: Function) {
  // Blog topic ideas for security-related content
  const blogTopics = [
    "SQLインジェクション攻撃とその対策",
    "クロスサイトスクリプティング（XSS）脆弱性を理解する",
    "コマンドインジェクション攻撃の検出と防止",
    "CSRFを防ぐためのベストプラクティス",
    "セキュアなAPIの設計方法とOAuth2の実装",
    "セッション管理の脆弱性とその対策",
    "サーバーサイドリクエストフォージェリ（SSRF）攻撃",
    "認証バイパス脆弱性とその対策",
    "セキュリティミスコンフィギュレーションの防止",
    "Webアプリケーションファイアウォール（WAF）の導入方法",
    "ブルートフォース攻撃からシステムを守る方法",
    "デシリアライゼーション攻撃とその対策",
    "パスワードハッシュとソルトの重要性",
    "ディレクトリトラバーサル脆弱性の理解と対策",
    "XML外部実体参照（XXE）攻撃の防御",
    "セキュアなファイルアップロード機能の実装",
    "モダンWebセキュリティヘッダーの重要性",
    "セキュリティコードレビューの方法と重要性",
    "DevSecOpsの導入とセキュアなCI/CDパイプライン",
    "ゼロトラストアーキテクチャの実装方法",
    "サプライチェーン攻撃からソフトウェアを守る方法",
    "バッファオーバーフロー攻撃の仕組みと対策",
    "セキュアなJavaScriptの実装方法",
    "APIセキュリティとOWASP API Top 10",
    "認証情報漏洩の防止とシークレット管理",
    "セキュアなDockerコンテナの構築",
    "クラウドセキュリティのベストプラクティス",
    "サイドチャネル攻撃の理解と防御",
    "DNSセキュリティとDNS Rebindingの対策",
    "セキュリティ障害発生時のインシデントレスポンス"
  ];
  
  // Shuffle the array to get random topics
  const shuffledTopics = [...blogTopics].sort(() => Math.random() - 0.5);
  
  // Get existing blog titles to avoid duplication
  const { data: existingBlogs, error: blogsError } = await supabase
    .from('vulnerabilities')
    .select('title')
    .not('severity', 'is', null)
    .not('title', 'ilike', 'CVE-%');
    
  if (blogsError) {
    throw blogsError;
  }
  
  const existingTitles = new Set((existingBlogs || []).map(blog => blog.title));
  
  // Select up to 20 topics that don't already exist
  const topicsToCreate = [];
  for (const topic of shuffledTopics) {
    if (!existingTitles.has(topic) && topicsToCreate.length < 20) {
      topicsToCreate.push(topic);
    }
  }
  
  // Generate blogs for the topics
  const generatedCount = await generateBlogs(topicsToCreate, supabase);
  
  // Update the schedule record
  await updateScheduleRecord('generate-blogs', supabase);
  
  // After blog generation, update sitemap
  const sitemapResponse = await supabase.functions.invoke('generate-sitemap');
  console.log('Sitemap regenerated after blog generation:', sitemapResponse);
  
  return {
    success: true, 
    message: `Successfully scheduled generation of ${generatedCount} blog posts and updated sitemap`, 
    topics: topicsToCreate
  };
}
