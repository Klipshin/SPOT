import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // You can change this to "gemini-2.0-pro" for more advanced responses
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `
You are an AI chatbot assistant for the SPOT (Species Protection & Online Tracking), a wildlife identification app focused on the Philippines.
Answer conversationally and clearly, with friendly educational tone.
If the user asks about animals, provide information related to Philippine species when possible.
`;

    const result = await model.generateContent([
      { text: `${context}\nUser: ${prompt}` },
    ]);

    const text = result.response.text();
    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
