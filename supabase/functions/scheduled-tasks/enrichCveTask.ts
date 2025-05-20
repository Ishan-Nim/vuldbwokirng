
// Task module for enriching CVE data
export async function handleEnrichCveTask(supabase: any, updateScheduleRecord: Function) {
  // Call the enrich-cve-data function directly
  const enrichResponse = await supabase.functions.invoke('enrich-cve-data');
  
  if (enrichResponse.error) {
    throw new Error(`Error enriching CVE data: ${enrichResponse.error.message}`);
  }
  
  // Update the schedule record
  await updateScheduleRecord('enrich-cve', supabase);
  
  return {
    success: true, 
    message: "CVE enrichment process completed successfully",
    result: enrichResponse.data
  };
}
