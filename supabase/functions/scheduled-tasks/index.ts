import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { task } = await req.json();

    if (task === "fetch-cve") {
      // Call the existing fetch-cve-data function
      const fetchResponse = await supabase.functions.invoke('fetch-cve-data');
      
      if (fetchResponse.error) {
        throw new Error(`Error fetching CVE data: ${fetchResponse.error.message}`);
      }

      // After successful fetch, update the schedule record
      await updateScheduleRecord('fetch-cve', supabase);
      
      // Trigger AI enrichment immediately after fetch
      const enrichResponse = await supabase.functions.invoke('enrich-cve-data');
      
      if (enrichResponse.error) {
        throw new Error(`Error enriching CVE data: ${enrichResponse.error.message}`);
      }
      
      // Update enrichment schedule record
      await updateScheduleRecord('enrich-cve', supabase);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "CVE data fetched and enrichment triggered", 
          fetchResult: fetchResponse.data,
          enrichResult: enrichResponse.data
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } 
    else if (task === "generate-blogs") {
      // Generate 20 unique blog posts about security topics
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
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Successfully scheduled generation of ${generatedCount} blog posts and updated sitemap`, 
          topics: topicsToCreate
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    else if (task === "update-sitemap") {
      // Call the generate-sitemap function
      const sitemapResponse = await supabase.functions.invoke('generate-sitemap');
      
      if (sitemapResponse.error) {
        throw new Error(`Error updating sitemap: ${sitemapResponse.error.message}`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Sitemap updated successfully"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    else {
      throw new Error(`Unknown task type: ${task}`);
    }
  } catch (error) {
    console.error('Error in scheduled task:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

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

// Helper function to update schedule records
async function updateScheduleRecord(taskType: string, supabase: any): Promise<void> {
  const now = new Date();
  
  // Calculate next run time based on task type
  let nextRunTime = new Date();
  
  if (taskType === 'fetch-cve') {
    // Schedule 5 times per day (every 4.8 hours)
    nextRunTime = new Date(now.getTime() + (4.8 * 60 * 60 * 1000));
  } 
  else if (taskType === 'enrich-cve') {
    // Schedule shortly after each fetch (10 minutes after fetch)
    nextRunTime = new Date(now.getTime() + (10 * 60 * 1000));
  }
  else if (taskType === 'generate-blogs') {
    // Schedule 20 blogs per day (spaced throughout day)
    nextRunTime = new Date(now.getTime() + (24 * 60 * 60 * 1000 / 20));
  }
  
  // Format the date for display
  const formattedNextRun = nextRunTime.toISOString();
  
  // Check if a record already exists for this task type
  const { data, error: selectError } = await supabase
    .from('scheduled_tasks')
    .select('id')
    .eq('task_type', taskType)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }
  
  if (data?.id) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('scheduled_tasks')
      .update({
        last_run: now.toISOString(),
        next_run: formattedNextRun,
        updated_at: now.toISOString()
      })
      .eq('id', data.id);
      
    if (updateError) {
      throw updateError;
    }
  } else {
    // Create new record
    const { error: insertError } = await supabase
      .from('scheduled_tasks')
      .insert({
        task_type: taskType,
        last_run: now.toISOString(),
        next_run: formattedNextRun
      });
      
    if (insertError) {
      throw insertError;
    }
  }
}
