import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Vercel timeout config (10s for Hobby, 60s for Pro)
export const maxDuration = 10;

// Initialize Gemini API
// SECURITY: Use server-side env var if available, fallback to public
const apiKey = process.env.GEMINI_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("[CHAT] ERROR: GEMINI API key not found");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  console.log('[CHAT] ===== REQUEST START =====');
  console.log('[CHAT] Timestamp:', new Date().toISOString());
  
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      console.log('[CHAT] ERROR: No prompt provided');
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    console.log('[CHAT] Prompt received, length:', prompt?.length);

    if (!apiKey) {
      console.log('[CHAT] ERROR: API key missing');
      throw new Error("GEMINI API key is not set");
    }

    const context = `
You are an AI chatbot assistant for the SPOT (Species Protection & Online Tracking), a wildlife identification app focused on the Philippines.
Answer conversationally and clearly, with friendly educational tone.
If the user asks about animals, provide information related to Philippine species when possible.
`;

    const promptText = `${context}\nUser: ${prompt}`;
    let responseText = '';

    console.log('[CHAT] Starting AI generation with gemini-2.5-flash...');

    // Primary model: gemini-2.5-flash
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([{ text: promptText }]);
      responseText = result.response.text();
      console.log('[CHAT] Primary model SUCCESS, response length:', responseText.length);
    } catch (primaryError) {
      console.log('[CHAT] Primary model FAILED:', primaryError);
      console.log('[CHAT] Trying fallback: gemini-2.5-pro...');

      // Fallback 1: gemini-2.5-pro
      try {
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-2.5-pro",
          generationConfig: {
            temperature: 0.7,
          }
        });
        const fallbackResult = await fallbackModel.generateContent([{ text: promptText }]);
        responseText = fallbackResult.response.text();
        console.log('[CHAT] Fallback model SUCCESS, response length:', responseText.length);
      } catch (fallbackError) {
        console.log('[CHAT] Fallback model FAILED:', fallbackError);
        console.log('[CHAT] Trying final fallback: gemini-2.5-flash-lite...');

        // Fallback 2: gemini-2.5-flash-lite
        try {
          const finalFallbackModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            generationConfig: {
              temperature: 0.7,
            }
          });
          const finalFallbackResult = await finalFallbackModel.generateContent([{ text: promptText }]);
          responseText = finalFallbackResult.response.text();
          console.log('[CHAT] Final fallback SUCCESS, response length:', responseText.length);
        } catch (finalFallbackError) {
          console.error('[CHAT] All models FAILED');
          console.error('[CHAT] Final fallback error:', finalFallbackError);
          throw new Error('All AI models failed. Please try again later.');
        }
      }
    }

    if (!responseText || responseText.trim() === '') {
      throw new Error('Received empty response from AI model');
    }

    console.log('[CHAT] ===== SUCCESS =====');
    console.log('[CHAT] Response generated successfully');

    return NextResponse.json({ reply: responseText });
  } catch (err: unknown) {
    console.error("[CHAT] ===== FATAL ERROR =====");
    console.error("[CHAT] Error:", err);
    
    if (err instanceof Error) {
      console.error("[CHAT] Message:", err.message);
      console.error("[CHAT] Stack:", err.stack);
    }
    
    const errorMessage = err instanceof Error ? err.message : 'Chat request failed';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        reply: "Sorry, I encountered an error while processing your message. Please try again later."
      }, 
      { status: 500 }
    );
  }
}
