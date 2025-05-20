
// Task module for fetching CVE data
export async function handleFetchCveTask(supabase: any, updateScheduleRecord: Function) {
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

  return {
    success: true, 
    message: "CVE data fetched and enrichment triggered", 
    fetchResult: fetchResponse.data,
    enrichResult: enrichResponse.data
  };
}
