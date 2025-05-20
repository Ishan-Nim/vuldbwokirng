
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

// CORS headers for all responses
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create and return Supabase client
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Server configuration error: Missing Supabase credentials");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Helper function to update schedule records
export async function updateScheduleRecord(taskType: string, supabase: any): Promise<void> {
  const now = new Date();
  
  // Calculate next run time based on task type
  let nextRunTime = new Date();
  
  if (taskType === 'fetch-cve') {
    // Schedule 5 times per day (every 4.8 hours)
    nextRunTime = new Date(now.getTime() + (4.8 * 60 * 60 * 1000));
  } 
  else if (taskType === 'enrich-cve') {
    // Schedule every 5 hours
    nextRunTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
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
