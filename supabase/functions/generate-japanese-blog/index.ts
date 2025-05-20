
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

特に金融機関や医療機関、政府機関などのデータベースが標的になりやすく、個人情報や機密データが漏洩するリスクが高まります。攻撃の兆候としては、データベースの異常な動作、予期しないエラーメッセージ、データの突然の変更などが挙げられます。

近年の調査によると、SQLインジェクション攻撃は依然としてOWASP Top 10のセキュリティリスクの上位に位置しています。この脆弱性は、適切な対策を講じることで完全に防ぐことが可能ですが、多くの組織ではまだ十分な対策が取られていないのが現状です。

特に注意すべきは、この攻撃手法が比較的簡単に実行できることです。基本的なSQLの知識があれば、自動化ツールを使用して脆弱性のあるWebサイトを短時間で特定し、攻撃することが可能です。そのため、開発者はセキュアコーディングの原則を理解し、常にユーザー入力を適切にサニタイズすることが重要です。

また、この脆弱性は単独で存在するだけでなく、他の脆弱性と組み合わさることで、より深刻な被害をもたらす可能性があります。例えば、SQLインジェクションとクロスサイトスクリプティング（XSS）が組み合わさると、攻撃者はユーザーの認証情報を盗み出し、さらに広範囲の攻撃を実行できるようになります。`,
      technical_impact: `この脆弱性の技術的影響は非常に広範囲に及びます。まず、データベースの完全な制御が可能になります。攻撃者はSELECT文を使用して機密データにアクセスし、INSERT、UPDATE、DELETE文を使用してデータを改ざんまたは破壊することができます。

さらに深刻なのは、多くのデータベースシステムでは、特定のコマンドを使用してオペレーティングシステムレベルでコマンドを実行できる機能があることです。例えば、Microsoft SQL Serverの場合、xp_cmdshellストアドプロシージャを使用してOSコマンドを実行できます。MySQLでは、特定の設定下でUDF（ユーザー定義関数）を使用してシステムコマンドを実行できます。

また、データベースサーバーの設定によっては、ファイルの読み書きが可能になる場合もあります。例えば、MySQLのLOAD_FILE関数を使用してサーバー上のファイルを読み取ったり、INTO OUTFILE機能を使用してファイルを書き込んだりすることができます。

技術的な観点からは、以下のような影響が考えられます：

1. データベース内のすべてのテーブルへのアクセス（権限昇格）
2. ストアドプロシージャの実行
3. システムテーブルの変更
4. メタデータの抽出（テーブル名、カラム名など）
5. データベースバックエンドOSへのアクセス
6. ネットワーク内部への侵入の足がかり
7. バッチジョブやスケジュールされたタスクの改ざん
8. セキュリティ監査ログの削除

特に重要なのは、SQLインジェクションが成功すると、攻撃の痕跡を消すことも可能になるということです。これにより、攻撃の検出がさらに困難になり、長期間にわたって攻撃者がシステム内に潜伏する可能性があります。`,
      business_impact: `ビジネスへの影響は多岐にわたり、短期的な損失から長期的な評判の低下まで様々な問題を引き起こします。まず、顧客データの漏洩による直接的な影響として、規制違反による罰金や賠償金の支払いがあります。例えば、GDPRの下では、違反企業に対して全世界の年間売上の4%または2,000万ユーロのいずれか高い方を上限とする罰金が科される可能性があります。

日本国内では、個人情報保護法の違反により、最大で1億円の罰金や、6ヶ月以下の懲役などの刑事罰が科される可能性があります。また、漏洩した個人情報の件数によっては、民事訴訟による損害賠償額が企業の存続を脅かすほど膨大になることもあります。

顧客信頼の喪失も深刻な問題です。2023年の調査によると、データ侵害を経験した企業の顧客の約60%が、その企業との取引を停止したり、別の企業に乗り換えたりしています。特に金融機関や医療機関など、高度な信頼が求められる業界では、この影響はより顕著です。

株価への影響も無視できません。大規模なデータ侵害が公になった場合、平均して企業の株価は約5%下落するとされており、回復までに6ヶ月以上かかることもあります。特に上場企業の場合、株主からの信頼喪失は経営陣の責任問題にまで発展する可能性があります。

さらに、事業継続の観点からも重大なリスクがあります。データベースが破壊された場合、サービスの中断が発生し、その間の売上損失だけでなく、システムの復旧コストも発生します。平均的なダウンタイムのコストは、業種によって異なりますが、1時間あたり数十万円から数千万円に及ぶケースもあります。

長期的には、サイバー保険の保険料上昇、セキュリティ体制強化のための追加投資、レピュテーション回復のためのマーケティング費用など、間接的なコストも発生します。これらの負担は、特に中小企業にとって大きな財政的圧迫となりかねません。`,
      is_vulnerable: true
    };

    const threatModeling = {
      exploitability: 3,
      prevalence: 3,
      detectability: 2,
      technical_impact_score: 3,
      business_impact_detail: `現実的なビジネスリスクとして、具体的に以下のような影響が考えられます：

1. GDPR違反による罰金：最大で全世界の年間売上の4%、または2,000万ユーロのいずれか高い方。日本企業であっても、EU市民のデータを扱っている場合は適用対象となります。

2. 個人情報保護法違反による罰金：日本国内では最大で1億円の罰金が科される可能性があります。

3. 顧客離れによる収益減少：平均して20~30%のユーザーが離脱する可能性があり、業種によっては年間売上の15%以上の損失に相当します。

4. 法的責任の増加：集団訴訟のリスクがあり、一件あたりの賠償金額は漏洩した個人情報の性質や件数によって大きく変動します（医療データなど機密性の高い情報の場合、賠償金額は高額になる傾向があります）。

5. サイバー保険料の上昇：インシデント後は平均で年間25~40%の保険料増加が予想されます。

6. 事業継続の危機：平均6日間のシステムダウンタイムが生じる可能性があり、業種によっては1日あたり数百万円から数千万円の損失につながります。

7. 復旧コスト：情報漏洩の調査、フォレンジック分析、システム修復、レピュテーション管理などを含め、平均で侵害1件あたり3,500〜5,000万円のコストが発生します。

8. M&Aや新規事業への悪影響：セキュリティインシデント後は企業価値評価が平均10~15%下落するため、将来的な事業展開に支障をきたす可能性があります。

9. 規制当局による調査と監視の強化：インシデント後は定期的な監査や報告義務が課される場合があり、コンプライアンスコストが増加します。`
    };

    const remediations = [
      {
        recommendation: `パラメータ化されたクエリ（プリペアドステートメント）を使用する。これにより、ユーザー入力とSQL命令を分離し、SQLインジェクション攻撃を防止できます。

具体的な実装例：
- Node.js + PostgreSQL: pg-promise や node-postgres ライブラリを使用する
- PHP: PDO パラメータ化クエリを使用する
- Java: PreparedStatement を使用する
- .NET: SqlParameter オブジェクトを使用する

例えば、以下のような脆弱なコードは：
\`\`\`
const query = "SELECT * FROM users WHERE username = '" + username + "'";
\`\`\`

次のように修正します：
\`\`\`
const query = "SELECT * FROM users WHERE username = $1";
const result = await client.query(query, [username]);
\`\`\`

すべての動的SQLクエリをパラメータ化されたステートメントに置き換えることを検討してください。特に、ユーザー入力やURL、Cookie、リクエストヘッダーなどの外部からのデータを扱う場合は必須です。`,
        priority_level: "必須"
      },
      {
        recommendation: `最小権限の原則に基づきデータベースユーザーのアクセス権を設定する。アプリケーションが必要とする最小限の権限だけを付与し、特に管理者権限での接続は避けてください。

具体的な実施手順：
1. アプリケーション専用のデータベースユーザーを作成する
2. そのユーザーに必要最低限の権限のみ付与する
3. 読み取り専用操作には読み取り専用のデータベースユーザーを使用する
4. 書き込み操作が必要な場合のみ、限定的な書き込み権限を付与する
5. ストアドプロシージャの実行権限を制限する
6. データベースユーザーのファイルシステムアクセスを制限する
7. 管理者権限を持つユーザーでアプリケーションからデータベースに接続しない

例えば、PostgreSQLでの権限付与の例：
\`\`\`
-- 読み取り専用ユーザーの作成
CREATE USER app_readonly WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

-- 書き込み権限を持つユーザーの作成（特定のテーブルのみ）
CREATE USER app_writer WITH PASSWORD 'another_secure_password';
GRANT SELECT, INSERT, UPDATE ON table1, table2 TO app_writer;
\`\`\`

定期的に権限を見直し、不要な権限を削除することも重要です。`,
        priority_level: "推奨"
      },
      {
        recommendation: `WAF（Webアプリケーションファイアウォール）を導入する。SQLインジェクションの一般的なパターンを検出してブロックするWAFを実装することで、アプリケーションコードに問題があっても追加のセキュリティレイヤーを提供できます。

推奨されるWAFソリューション：
1. クラウドサービス型WAF
   - AWS WAF
   - Cloudflare WAF
   - Google Cloud Armor
   - Azure Web Application Firewall

2. オンプレミス/オープンソースWAF
   - ModSecurity（Apache, Nginx, IIS対応）
   - NAXSI（Nginx向け）
   - Shadow Daemon
   - Ironbee

3. 商用アプライアンス型WAF
   - F5 Advanced WAF
   - Imperva WAF
   - Barracuda WAF
   - Fortinet FortiWeb

WAF導入後は、以下の点を確認してください：
- SQLインジェクション対策のルールが有効になっていること
- 誤検知（false positive）を適切に調整すること
- ログモニタリングを設定し、攻撃の試みを検知できるようにすること
- 定期的にWAFのルールを更新し、新しい攻撃パターンに対応すること

特に重要なのは、WAFを「防御の最後の砦」ではなく、多層防御戦略の一部として位置づけることです。`,
        priority_level: "推奨"
      },
      {
        recommendation: `エラーメッセージに詳細な情報を含めない。データベースエラーの詳細をユーザーに表示しないようにし、代わりに一般的なエラーメッセージを表示しながら、バックエンドでログを記録してください。

実装すべき対策：
1. 本番環境では、詳細なデータベースエラーメッセージを無効にする
2. カスタムエラーハンドラーを実装し、ユーザーには一般的なエラーメッセージのみを表示する
3. 詳細なエラー情報はサーバーログにのみ記録する
4. ログには十分なコンテキスト情報を含めるが、機密情報は含めない
5. エラーログは定期的に監視・分析する仕組みを構築する

例えば、以下のような脆弱なコード：
\`\`\`
try {
  // データベース操作
} catch (e) {
  // 危険：エラー詳細をそのまま表示
  response.send("データベースエラー: " + e.message);
}
\`\`\`

次のように修正します：
\`\`\`
try {
  // データベース操作
} catch (e) {
  // エラーをログに記録（詳細情報を含む）
  logger.error("データベースエラー", { error: e, userId: req.user.id, action: "データ取得" });
  // ユーザーには一般的なメッセージのみを表示
  response.status(500).send("処理中にエラーが発生しました。しばらく経ってからもう一度お試しください。");
}
\`\`\`

これらのエラーをセキュアに監視およびログ記録するシステムを実装し、異常なパターンを検出できるようにすることが重要です。`,
        priority_level: "推奨"
      },
      {
        recommendation: `入力値のバリデーションと出力のエスケープを実施する。すべてのユーザー入力に対して、型、長さ、形式、範囲のチェックを含む厳格な入力バリデーションを実装してください。

入力バリデーションの方法：
1. ホワイトリスト（許可リスト）アプローチを採用する
   - 許可される文字や値のみを受け入れる
   - 正規表現を使用して入力形式を検証する
   - 入力の型と範囲を厳密にチェックする

2. 特殊文字のエスケープ
   - SQLインジェクション対策として特殊文字（'、"、\\、NULL文字など）をエスケープする
   - 特にデータベースの種類に応じた適切なエスケープ処理を実装する

3. データサニタイズ
   - HTMLタグや危険なJavaScriptの削除
   - 入力データを適切な型に変換する（例：数値パラメータは必ず数値型に変換する）

サーバーサイドでの実装例（Node.js + Express）：
\`\`\`
const validator = require('validator');

app.post('/api/user', (req, res) => {
  const userId = req.body.userId;
  
  // 入力バリデーション
  if (!userId || !validator.isInt(userId.toString()) || parseInt(userId) <= 0) {
    return res.status(400).json({ error: '有効なユーザーIDを入力してください' });
  }
  
  // ここでIDを数値に確実に変換してからデータベースクエリに使用
  const userIdNum = parseInt(userId);
  // ...以降の処理
});
\`\`\`

クライアントサイドでもバリデーションを実装しますが、これはユーザー体験向上のためであり、セキュリティ対策としては不十分です。必ずサーバーサイドでも厳格なバリデーションを行ってください。`,
        priority_level: "必須"
      },
      {
        recommendation: `データベースの監査と監視を強化する。不正なデータベースアクセスや異常なクエリパターンを検出するための監視システムを導入してください。

具体的な実装手順：
1. データベースアクティビティ監視（DAM）ソリューションの導入
   - すべてのSQL文の記録
   - 通常とは異なるクエリパターンの検出
   - 異常な量のデータアクセスの検出

2. ログ分析の自動化
   - SOCサービスやSIEMツールとの統合
   - 機械学習ベースの異常検知システムの導入

3. アラート設定
   - 危険なSQLコマンド（UNION, DROP, TRUNCATE など）の検知
   - 管理者権限での操作の監視
   - 通常業務時間外のアクセスの監視

4. 定期的なセキュリティ監査
   - 脆弱性スキャンの実施
   - ペネトレーションテストの実施
   - コードレビューの実施

推奨ツール：
- Oracle Audit Vault
- IBM Guardium
- Imperva SecureSphere Database Audit and Protection
- McAfee Database Activity Monitoring
- オープンソースの場合：OSSEC, Wazuh, ELK Stack with Watcher

これらの監査システムにより、攻撃の早期発見と対応が可能になり、被害を最小限に抑えることができます。`,
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
      },
      {
        ref_type: "事例",
        ref_url: "https://owasp.org/www-community/attacks/SQL_Injection",
        ref_title: "過去のSQLインジェクション攻撃事例集"
      },
      {
        ref_type: "動画",
        ref_url: "https://www.youtube.com/watch?v=ciNHn38EyRc",
        ref_title: "SQLインジェクション攻撃の理解と防御 - セキュリティ講座"
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
