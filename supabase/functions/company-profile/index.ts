
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify we have the OpenAI API key
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    const { companyName } = await req.json();
    
    if (!companyName) {
      throw new Error("Company name is required");
    }

    // Call OpenAI to generate company profile
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI assistant specialized in company intelligence. Generate a detailed profile for the given company with these exact fields: name, website, headOffice, employeeCount, mainBusiness (array), established, capital, revenue, dataBreaches (array), isListed, stockPrice, country, isJapaneseListed. Format as JSON.' 
          },
          { 
            role: 'user', 
            content: `Generate a company profile for: ${companyName}` 
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Try to extract JSON from the content if it's not already JSON
    let profileData;
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/({[\s\S]*})/);
      profileData = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", content);
      throw new Error("Failed to parse the generated company profile");
    }

    return new Response(JSON.stringify({ success: true, profile: profileData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in company-profile function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
