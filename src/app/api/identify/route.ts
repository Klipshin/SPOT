import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Wikipedia summary + image helper
 */
async function getWikipediaSummary(scientificName: string) {
  const queryName = encodeURIComponent(`${scientificName} Philippines`);
  let response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${queryName}`
  );

  if (!response.ok) {
    response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        scientificName
      )}`
    );
  }

  if (!response.ok) return null;

  const data = await response.json();
  return {
    summary: data.extract || "No summary available.",
    link: data.content_urls?.desktop?.page || null,
    image: data.thumbnail?.source || null,
  };
}

/**
 * POST handler for /api/identify
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert in Philippine wildlife identification.
Analyze this image and provide the **Top 3 most likely species** found in the Philippines.

For each prediction, return:
- common_name
- scientific_name
- confidence (0–100, based on how certain you are)
- danger_level (venomous / harmless / dangerous / mildly venomous)
- status (native / endemic / invasive)
- conservation_status (endangered / vulnerable / least concern)

If confidence for the top species is 98 or higher AND it is not venomous or dangerous, include only that one prediction.

Return strictly a valid JSON array like:
[
  {
    "common_name": "",
    "scientific_name": "",
    "confidence": 97,
    "danger_level": "",
    "status": "",
    "conservation_status": ""
  }
]
Do not include any explanations or text outside the JSON.
`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64Image, mimeType } },
    ]);

    const rawText = result.response.text();

    let predictions: any[] = [];
    try {
      predictions = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      predictions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    // Safety logic: keep multiple predictions unless very confident AND harmless
    if (predictions.length > 1) {
      const top = predictions[0];
      const highRisk = /venomous|dangerous/i.test(top.danger_level);
      if (!highRisk && top.confidence >= 98) {
        predictions = [top];
      }
    }

    // Wikipedia enrichment
    for (const item of predictions) {
      if (!item.scientific_name) continue;
      const wiki = await getWikipediaSummary(item.scientific_name);
      item.wiki_summary = wiki?.summary || "No summary found.";
      item.wiki_link = wiki?.link;
      item.wiki_image = wiki?.image;
    }

    return NextResponse.json({ predictions });
  } catch (err: any) {
    console.error("Error identifying image:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
