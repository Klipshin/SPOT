import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Vercel timeout config (10s for Hobby, 60s for Pro)
export const maxDuration = 10;

// Initialize Gemini API
const apiKey = process.env.GEMINI_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("[AI_CHAT] ERROR: GEMINI API key not found");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  console.log('[AI_CHAT] ===== REQUEST START =====');
  console.log('[AI_CHAT] Timestamp:', new Date().toISOString());
  
  try {
    const { message, history = [], isInitialExplanation = false, cardContext } = await req.json();

    if (!message || message.trim() === "") {
      console.log('[AI_CHAT] ERROR: No message provided');
      return NextResponse.json({ 
        success: false, 
        error: "No message provided",
        response: null 
      }, { status: 400 });
    }

    console.log('[AI_CHAT] Message received, length:', message?.length);
    console.log('[AI_CHAT] Is initial explanation:', isInitialExplanation);
    console.log('[AI_CHAT] History length:', history.length);

    if (!apiKey) {
      console.log('[AI_CHAT] ERROR: API key missing');
      return NextResponse.json({ 
        success: false, 
        error: "API key is not set",
        response: null 
      }, { status: 500 });
    }

    // Build conversation history for Gemini
    const chatHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Build context-aware system prompt
    let systemPrompt = `You are Chika, a friendly and enthusiastic AI assistant for SPOT (Species Protection & Online Tracking), a wildlife identification app focused on the Philippines.

Your personality:
- Be warm, conversational, and genuinely excited about wildlife and nature
- Use emojis occasionally to add personality (but don't overdo it)
- Show enthusiasm when discussing animals, plants, fungi, and all living beings
- Be encouraging and supportive of users learning about biodiversity
- Keep responses concise but informative (2-4 sentences for follow-ups, 3-6 for initial explanations)
- Use natural, friendly language - like talking to a friend who's curious about nature

When discussing living beings:
- Animals (mammals, birds, reptiles, amphibians, fish, insects, arachnids, etc.)
- Plants (trees, flowers, ferns, mosses, etc.)
- Fungi (mushrooms, molds, etc.)
- Humans - acknowledge them with a unique, respectful response that recognizes their special place in nature

For humans specifically, you might say something like: "I can see a human in this image! Humans are fascinating creatures - we're part of the great ape family and have played a unique role in shaping ecosystems. While SPOT focuses on wildlife, it's wonderful to see people engaging with nature!"`;

    if (isInitialExplanation && cardContext) {
      systemPrompt += `\n\nYou are explaining a flashcard to help the user learn. The flashcard contains:
Front: ${cardContext.front}
Back: ${cardContext.back}

Provide a clear, engaging explanation that helps them understand and remember this information. Make it conversational and encouraging!`;
    } else if (cardContext) {
      systemPrompt += `\n\nYou are answering a follow-up question about a flashcard. The flashcard context:
Front: ${cardContext.front}
Back: ${cardContext.back}

Use this context to provide relevant, helpful answers.`;
    }

    // Create model with higher temperature for more lively responses
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9, // Higher temperature for more creative, lively responses
        topP: 0.95,
        topK: 40,
      }
    });

    let responseText = '';

    // Start chat session with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    // Add system prompt as first message if no history
    const fullPrompt = history.length === 0 
      ? `${systemPrompt}\n\nUser: ${message}`
      : message;

    console.log('[AI_CHAT] Starting AI generation with gemini-2.5-flash...');

    try {
      const result = await chat.sendMessage(fullPrompt);
      responseText = result.response.text();
      console.log('[AI_CHAT] Primary model SUCCESS, response length:', responseText.length);
    } catch (primaryError) {
      console.log('[AI_CHAT] Primary model FAILED:', primaryError);
      console.log('[AI_CHAT] Trying fallback: gemini-2.5-pro...');

      // Fallback 1: gemini-2.5-pro
      try {
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-2.5-pro",
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
          }
        });
        
        const fallbackChat = fallbackModel.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
          },
        });
        
        const fallbackResult = await fallbackChat.sendMessage(fullPrompt);
        responseText = fallbackResult.response.text();
        console.log('[AI_CHAT] Fallback model SUCCESS, response length:', responseText.length);
      } catch (fallbackError) {
        console.log('[AI_CHAT] Fallback model FAILED:', fallbackError);
        console.log('[AI_CHAT] Trying final fallback: gemini-2.5-flash-lite...');

        // Fallback 2: gemini-2.5-flash-lite
        try {
          const finalFallbackModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            generationConfig: {
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
            }
          });
          
          const finalFallbackChat = finalFallbackModel.startChat({
            history: chatHistory,
            generationConfig: {
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
            },
          });
          
          const finalFallbackResult = await finalFallbackChat.sendMessage(fullPrompt);
          responseText = finalFallbackResult.response.text();
          console.log('[AI_CHAT] Final fallback SUCCESS, response length:', responseText.length);
        } catch (finalFallbackError) {
          console.error('[AI_CHAT] All models FAILED');
          console.error('[AI_CHAT] Final fallback error:', finalFallbackError);
          throw new Error('All AI models failed. Please try again later.');
        }
      }
    }

    if (!responseText || responseText.trim() === '') {
      throw new Error('Received empty response from AI model');
    }

    console.log('[AI_CHAT] ===== SUCCESS =====');
    console.log('[AI_CHAT] Response generated successfully');

    return NextResponse.json({ 
      success: true, 
      response: responseText,
      error: null 
    });
  } catch (err: unknown) {
    console.error("[AI_CHAT] ===== FATAL ERROR =====");
    console.error("[AI_CHAT] Error:", err);
    
    if (err instanceof Error) {
      console.error("[AI_CHAT] Message:", err.message);
      console.error("[AI_CHAT] Stack:", err.stack);
    }
    
    const errorMessage = err instanceof Error ? err.message : 'Chat request failed';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        response: "Sorry, I encountered an error while processing your message. Please try again later."
      }, 
      { status: 500 }
    );
  }
}
