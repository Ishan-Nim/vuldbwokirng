
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

    // For demo purposes, create a more comprehensive response
    // In a real implementation, this would call OpenAI API
    const vulnerability = {
      title,
      severity: "高",
      risk_rating: "重大",
      description: `${title}は、Webアプリケーションに対する一般的な攻撃手法です。この脆弱性により、攻撃者はデータベースに悪意のあるSQLコードを挿入して、データの漏洩、改ざん、削除などを行うことができます。
      
この種の攻撃は、入力値のバリデーションが不十分な場合に発生します。攻撃者はフォーム、URL、Cookieなどを通じて悪意のあるSQLクエリを挿入し、データベースを操作します。その結果、機密情報の開示、データの破壊、認証メカニズムのバイパスなどが発生する可能性があります。

特に金融機関や医療機関、政府機関などのデータベースが標的になりやすく、個人情報や機密データが漏洩するリスクが高まります。攻撃の兆候としては、データベースの異常な動作、予期しないエラーメッセージ、データの突然の変更などが挙げられます。`,
      technical_impact: "データベースの完全な制御、機密情報へのアクセス、認証のバイパス、システム全体の乗っ取りが可能です。攻撃者はデータベース内のすべてのテーブルにアクセスでき、SELECT、INSERT、UPDATE、DELETE操作を実行できる可能性があります。また、ストアドプロシージャの実行や、場合によってはオペレーティングシステムのコマンド実行も可能になることがあります。",
      business_impact: "顧客データの漏洩、規制違反による罰金、ブランドの評判低下、顧客信頼の喪失、訴訟リスクの増加、事業継続の危機が生じる可能性があります。特にGDPRやCCPA、PIPEDAなどのデータ保護法に違反した場合、多額の罰金が課される可能性があります。さらに、データ侵害が公になると、企業の株価下落や市場シェアの減少につながることもあります。",
      is_vulnerable: true
    };

    const threatModeling = {
      exploitability: 3,
      prevalence: 3,
      detectability: 2,
      technical_impact_score: 3,
      business_impact_detail: "GDPR違反による罰金のリスク（最大で全世界の年間売上の4%、または2,000万ユーロのいずれか高い方）、顧客離れによる収益減少（平均して20%のユーザーが離脱する可能性）、法的責任の増加（集団訴訟のリスク）、サイバー保険料の上昇（最大で年間30%増加）、事業継続の危機（平均6日間のシステムダウンタイム）、復旧コスト（平均で侵害1件あたり386万ドル）などのビジネスリスクがあります。"
    };

    const remediations = [
      {
        recommendation: "パラメータ化されたクエリ（プリペアドステートメント）を使用する。これにより、ユーザー入力とSQL命令を分離し、SQLインジェクション攻撃を防止できます。すべての動的SQLクエリをパラメータ化されたステートメントに置き換えることを検討してください。",
        priority_level: "必須"
      },
      {
        recommendation: "最小権限の原則に基づきデータベースユーザーのアクセス権を設定する。アプリケーションが必要とする最小限の権限だけを付与し、特に管理者権限での接続は避けてください。読み取り専用操作には読み取り専用のデータベースユーザーを使用し、書き込み操作が必要な場合のみ、限定的な書き込み権限を付与してください。",
        priority_level: "推奨"
      },
      {
        recommendation: "WAF（Webアプリケーションファイアウォール）を導入する。SQLインジェクションの一般的なパターンを検出してブロックするWAFを実装することで、アプリケーションコードに問題があっても追加のセキュリティレイヤーを提供できます。AWS WAF、Cloudflare WAF、ModSecurity、Impervaなどの商用またはオープンソースのWAFソリューションを検討してください。",
        priority_level: "推奨"
      },
      {
        recommendation: "エラーメッセージに詳細な情報を含めない。データベースエラーの詳細をユーザーに表示しないようにし、代わりに一般的なエラーメッセージを表示しながら、バックエンドでログを記録してください。本番環境では、詳細なデータベースエラーメッセージを無効にし、これらのエラーをセキュアに監視およびログ記録するシステムを実装してください。",
        priority_level: "推奨"
      },
      {
        recommendation: "入力値のバリデーションと出力のエスケープを実施する。すべてのユーザー入力に対して、型、長さ、形式、範囲のチェックを含む厳格な入力バリデーションを実装してください。加えて、SQLインジェクション対策として、特殊文字のエスケープも行ってください。",
        priority_level: "必須"
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
      },
      {
        ref_type: "ガイド",
        ref_url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        ref_title: "OWASP SQLインジェクション対策チートシート"
      },
      {
        ref_type: "論文",
        ref_url: "https://dl.acm.org/doi/10.1145/1066421.1066431",
        ref_title: "SQLインジェクション攻撃とその対策に関する研究"
      },
      {
        ref_type: "ツール",
        ref_url: "https://portswigger.net/burp",
        ref_title: "Burp Suite - SQLインジェクション検査ツール"
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
