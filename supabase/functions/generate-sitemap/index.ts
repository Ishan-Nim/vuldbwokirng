
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
    const baseUrl = req.headers.get('origin') || 'https://ehow-vulnerability.com';
    
    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all vulnerabilities with no limit (including both CVEs and blog posts)
    const { data: vulnerabilities, error: vulnerabilityError } = await supabase
      .from('vulnerabilities')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false });
      
    if (vulnerabilityError) {
      throw vulnerabilityError;
    }

    // Generate sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add homepage
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/</loc>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';
    
    // Add blog list page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/blog</loc>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>0.9</priority>\n';
    sitemap += '  </url>\n';
    
    // Add purpose page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/purpose</loc>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';

    // Admin page removed from sitemap

    // Add all vulnerabilities (both CVEs and blog posts)
    if (vulnerabilities && vulnerabilities.length > 0) {
      console.log(`Adding ${vulnerabilities.length} vulnerabilities to sitemap`);
      
      for (const vuln of vulnerabilities) {
        const lastMod = vuln.updated_at ? new Date(vuln.updated_at).toISOString().split('T')[0] : '';
        
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/blog/${vuln.id}</loc>\n`;
        if (lastMod) {
          sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
        }
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
      }
    } else {
      console.log("No vulnerabilities found to add to sitemap");
    }
    
    sitemap += '</urlset>';

    // Return the sitemap XML with appropriate headers
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
