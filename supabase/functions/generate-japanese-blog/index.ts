
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

  try {
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return new Response(
        JSON.stringify({ error: "Title is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For demo purposes, create a mock response
    // In a real implementation, this would call OpenAI API
    const vulnerability = {
      title,
      severity: "高",
      risk_rating: "重大",
      description: `${title}は、Webアプリケーションに対する一般的な攻撃手法です。この脆弱性により、攻撃者はデータベースに悪意のあるSQLコードを挿入して、データの漏洩、改ざん、削除などを行うことができます。`,
      technical_impact: "データベースの完全な制御、機密情報へのアクセス、認証のバイパス",
      business_impact: "顧客データの漏洩、規制違反による罰金、ブランドの評判低下",
      is_vulnerable: true
    };

    const threatModeling = {
      exploitability: 3,
      prevalence: 3,
      detectability: 2,
      technical_impact_score: 3,
      business_impact_detail: "GDPR違反による罰金のリスク、顧客離れによる収益減少、法的責任の増加"
    };

    const remediations = [
      {
        recommendation: "パラメータ化されたクエリ（プリペアドステートメント）を使用する",
        priority_level: "必須"
      },
      {
        recommendation: "最小権限の原則に基づきデータベースユーザーのアクセス権を設定する",
        priority_level: "推奨"
      },
      {
        recommendation: "WAF（Webアプリケーションファイアウォール）を導入する",
        priority_level: "推奨"
      }
    ];

    const references = [
      {
        ref_type: "OWASP",
        ref_url: "https://owasp.org/www-project-top-ten/2017/A1_2017-Injection",
        ref_title: "OWASP Top 10 - A1:2017-インジェクション"
      },
      {
        ref_type: "CWE",
        ref_url: "https://cwe.mitre.org/data/definitions/89.html",
        ref_title: "CWE-89: SQLインジェクション"
      }
    ];

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert vulnerability
    const { data: vulnData, error: vulnError } = await supabase
      .from("vulnerabilities")
      .insert(vulnerability)
      .select("id")
      .single();

    if (vulnError) {
      console.error("Error inserting vulnerability:", vulnError);
      throw vulnError;
    }

    const vulnerabilityId = vulnData.id;

    // Insert threat modeling
    const { error: threatError } = await supabase
      .from("threat_modeling")
      .insert({
        ...threatModeling,
        vulnerability_id: vulnerabilityId
      });

    if (threatError) {
      console.error("Error inserting threat modeling:", threatError);
      throw threatError;
    }

    // Insert remediations
    const remedationsWithVulnId = remediations.map(rem => ({
      ...rem,
      vulnerability_id: vulnerabilityId
    }));

    const { error: remError } = await supabase
      .from("remediations")
      .insert(remedationsWithVulnId);

    if (remError) {
      console.error("Error inserting remediations:", remError);
      throw remError;
    }

    // Insert references
    const referencesWithVulnId = references.map(ref => ({
      ...ref,
      vulnerability_id: vulnerabilityId
    }));

    const { error: refError } = await supabase
      .from("references")
      .insert(referencesWithVulnId);

    if (refError) {
      console.error("Error inserting references:", refError);
      throw refError;
    }

    return new Response(
      JSON.stringify({ success: true, vulnerabilityId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating blog:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
