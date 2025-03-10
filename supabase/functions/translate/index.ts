
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// A mock translation function for demonstration
// In a real application, you would integrate a proper translation API like Google Translate
const mockTranslate = (text: string, targetLang: string): string => {
  if (!text) return '';
  
  // Simple mock translation for demonstration
  if (targetLang === 'hi') {
    // This is NOT a real translation - just for demonstration
    return `[हिंदी अनुवाद] ${text}`;
  } else {
    return `[English translation] ${text}`;
  }
};

// In a real app, you would use a proper translation API like this:
// async function translateWithGoogleAPI(text: string, targetLang: string) {
//   const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
//   const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
//   
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       q: text,
//       target: targetLang
//     })
//   });
//   
//   const data = await response.json();
//   return data.data.translations[0].translatedText;
// }

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const { text, targetLang } = await req.json();
    
    if (!text || !targetLang) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: text and targetLang' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Perform translation - in a real app, you would call an actual translation API
    const translatedText = mockTranslate(text, targetLang);
    
    return new Response(
      JSON.stringify({ translatedText }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Translation error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to translate text' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
