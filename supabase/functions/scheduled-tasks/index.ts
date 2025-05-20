
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createSupabaseClient, updateScheduleRecord } from "./utils.ts";
import { handleFetchCveTask } from "./fetchCveTask.ts";
import { handleBlogGenTask } from "./blogGenTask.ts";
import { handleSitemapTask } from "./sitemapTask.ts";
import { handleEnrichCveTask } from "./enrichCveTask.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    const { task } = await req.json();

    // Execute the requested task
    let result;
    
    switch (task) {
      case "fetch-cve":
        result = await handleFetchCveTask(supabase, updateScheduleRecord);
        break;
        
      case "generate-blogs":
        result = await handleBlogGenTask(supabase, updateScheduleRecord);
        break;
        
      case "update-sitemap":
        result = await handleSitemapTask(supabase);
        break;
        
      case "enrich-cve":
        result = await handleEnrichCveTask(supabase, updateScheduleRecord);
        break;
        
      default:
        throw new Error(`Unknown task type: ${task}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
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
