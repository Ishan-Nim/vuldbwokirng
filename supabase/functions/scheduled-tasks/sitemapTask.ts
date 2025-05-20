
// Task module for updating sitemap
export async function handleSitemapTask(supabase: any) {
  // Call the generate-sitemap function
  const sitemapResponse = await supabase.functions.invoke('generate-sitemap');
  
  if (sitemapResponse.error) {
    throw new Error(`Error updating sitemap: ${sitemapResponse.error.message}`);
  }
  
  return {
    success: true, 
    message: "Sitemap updated successfully"
  };
}
