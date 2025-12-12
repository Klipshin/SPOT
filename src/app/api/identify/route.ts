import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Vercel timeout config (10s for Hobby, 60s for Pro)
export const maxDuration = 10;

// SECURITY: Use server-side env var if available, fallback to public
const apiKey = process.env.GEMINI_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("[IDENTIFY] ERROR: GEMINI API key not found");
}

const genAI = new GoogleGenerativeAI(apiKey);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spot-local.example'; // Define outside functions

/**
 * Wikipedia summary + image helper
 */
async function getWikipediaSummary(scientificName: string) {
  const queryName = encodeURIComponent(`${scientificName} Philippines`);
  // Use a traceable User-Agent based on your site URL
  const headers = {
    'User-Agent': `SPOT/1.0 (+${SITE_URL})`, // UPDATED
    Accept: 'application/json',
  };

  let response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${queryName}`,
    { headers }
  );

  if (!response.ok) {
    // Try without the country qualifier
    response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        scientificName
      )}`,
      { headers }
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

// Prediction type for identification results (unchanged)
type Prediction = {
  common_name?: string;
  scientific_name?: string;
  confidence?: number;
  danger_level?: string;
  status?: string;
  conservation_status?: string;
  wiki_summary?: string | null;
  wiki_link?: string | null;
  wiki_image?: string | null;
  // iNaturalist enrichment
  inat_taxon_id?: number | null;
  inat_url?: string | null;
  inat_default_photo?: string | null;
  inat_observations?: number | null;
  inat_conservation_status?: string | null;
  inat_preferred_common_name?: string | null;
};

// iNaturalist helper: find best matching taxon for a scientific name
async function getINatTaxon(scientificName: string) {
  try {
    const q = encodeURIComponent(scientificName);
    const res = await fetch(`https://api.inaturalist.org/v1/taxa?q=${q}&per_page=1`, {
      headers: { Accept: 'application/json', 'User-Agent': `SPOT/1.0 (+${SITE_URL})` }, // ADDED USER-AGENT
    });
    if (!res.ok) return null;
    const json = await res.json();
    const taxon = json.results?.[0];
    if (!taxon) return null;
    return {
      taxon_id: taxon.id,
      url: taxon.url || `https://www.inaturalist.org/taxa/${taxon.id}`,
      default_photo: taxon.default_photo?.medium_url || taxon.default_photo?.square_url || null,
      preferred_common_name: taxon.preferred_common_name || null,
      observations_count: taxon.observations_count ?? null,
      conservation_status: taxon.conservation_status?.status_name || null,
    };
  } catch (err) {
    console.error('iNaturalist lookup failed for', scientificName, err);
    return null;
  }
}

/**
 * POST handler for /api/identify
 */
export async function POST(req: Request) {
  console.log('[IDENTIFY] ===== REQUEST START =====');
  console.log('[IDENTIFY] Timestamp:', new Date().toISOString());
  
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      console.log('[IDENTIFY] ERROR: No image uploaded');
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    console.log('[IDENTIFY] Image received, size:', file.size, 'type:', file.type);

    if (!apiKey) {
      console.log('[IDENTIFY] ERROR: API key missing');
      throw new Error("GEMINI API key is not set");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // UPDATED PROMPT TO IDENTIFY ALL LIVING BEINGS
    const prompt = `
You are an expert in identifying all living beings, with a focus on Philippine biodiversity.

**IDENTIFICATION RULES:**
1. First, analyze the image to determine if it contains a **REAL, LIVING BEING**.
2. **IMMEDIATELY RETURN AN EMPTY ARRAY "[]"** if the image contains ONLY:
   - Non-living objects (cars, furniture, toys, statues, figurines, buildings, etc.)
   - Cartoons, anime, drawings, sketches, or digital art (unless they depict real species for educational purposes)
   - Food or cooked dishes (unless showing the original living organism)
   - Pure scenery/landscapes with no visible living organism
3. **PROCEED WITH IDENTIFICATION** if the image contains any living being:
   - Animals: Mammals, Birds, Reptiles, Amphibians, Fish, Insects, Arachnids, Crustaceans, Mollusks, etc.
   - Plants: Trees, Flowers, Ferns, Mosses, Algae, etc.
   - Fungi: Mushrooms, Molds, Lichens, etc.
   - Humans: People, faces, body parts (provide unique identification)

**SPECIAL HANDLING FOR HUMANS:**
If the image contains a human, return a single prediction with:
- common_name: "Human" or "Homo sapiens"
- scientific_name: "Homo sapiens"
- confidence: 95-100
- danger_level: "harmless" (or "dangerous" if context suggests threat, but default to harmless)
- status: "native" (humans are native to the Philippines)
- conservation_status: "least concern"

**FOR OTHER LIVING BEINGS:**
Provide the **Top 3 most likely species** found in the Philippines (or globally if not Philippine-specific).

For each prediction, return:
- common_name
- scientific_name
- confidence (0–100, based on how certain you are)
- danger_level (venomous / harmless / dangerous / mildly venomous / N/A for plants and fungi)
- status (native / endemic / invasive / introduced)
- conservation_status (endangered / vulnerable / least concern / data deficient)

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

    const contentInput = [
      { text: prompt },
      { inlineData: { data: base64Image, mimeType } },
    ];

    let rawText = '';

    console.log('[IDENTIFY] Starting AI generation with gemini-2.5-flash...');

    // Primary model: gemini-2.5-flash
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(contentInput);
      rawText = result.response.text();
      console.log('[IDENTIFY] Primary model SUCCESS, response length:', rawText.length);
    } catch (primaryError) {
      console.log('[IDENTIFY] Primary model FAILED:', primaryError);
      console.log('[IDENTIFY] Trying fallback: gemini-2.5-pro...');

      // Fallback 1: gemini-2.5-pro
      try {
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-2.5-pro",
          generationConfig: {
            temperature: 0.7,
          }
        });
        const fallbackResult = await fallbackModel.generateContent(contentInput);
        rawText = fallbackResult.response.text();
        console.log('[IDENTIFY] Fallback model SUCCESS, response length:', rawText.length);
      } catch (fallbackError) {
        console.log('[IDENTIFY] Fallback model FAILED:', fallbackError);
        console.log('[IDENTIFY] Trying final fallback: gemini-2.5-flash-lite...');

        // Fallback 2: gemini-2.5-flash-lite
        try {
          const finalFallbackModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            generationConfig: {
              temperature: 0.7,
            }
          });
          const finalFallbackResult = await finalFallbackModel.generateContent(contentInput);
          rawText = finalFallbackResult.response.text();
          console.log('[IDENTIFY] Final fallback SUCCESS, response length:', rawText.length);
        } catch (finalFallbackError) {
          console.error('[IDENTIFY] All models FAILED');
          console.error('[IDENTIFY] Final fallback error:', finalFallbackError);
          throw new Error('All AI models failed. The service may be temporarily unavailable. Please try again later.');
        }
      }
    }

    if (!rawText || rawText.trim() === '') {
      throw new Error('Received empty response from AI model');
    }

    let predictions: Prediction[] = [];
    try {
      predictions = JSON.parse(rawText) as Prediction[];
    } catch {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      predictions = jsonMatch ? (JSON.parse(jsonMatch[0]) as Prediction[]) : [];
    }

    // Safety logic: keep multiple predictions unless very confident AND harmless
    if (predictions.length > 1) {
      const top = predictions[0];
      const highRisk = /venomous|dangerous/i.test(String(top.danger_level ?? ""));
      if (!highRisk && (top.confidence ?? 0) >= 98) {
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

    // iNaturalist enrichment (non-blocking per-item)
    for (const item of predictions) {
      if (!item.scientific_name) continue;
      try {
        const inat = await getINatTaxon(item.scientific_name);
        if (inat) {
          item.inat_taxon_id = inat.taxon_id;
          item.inat_url = inat.url;
          item.inat_default_photo = inat.default_photo;
          item.inat_observations = inat.observations_count;
          item.inat_conservation_status = inat.conservation_status;
          item.inat_preferred_common_name = inat.preferred_common_name;
        }
      } catch (e) {
        console.error('Failed to enrich prediction with iNaturalist', e);
      }
    }

    console.log('[IDENTIFY] ===== SUCCESS =====');
    console.log('[IDENTIFY] Generated', predictions.length, 'predictions');

    return NextResponse.json({ predictions });
  } catch (err: unknown) {
    console.error("[IDENTIFY] ===== FATAL ERROR =====");
    console.error("[IDENTIFY] Error:", err);
    
    if (err instanceof Error) {
      console.error("[IDENTIFY] Message:", err.message);
      console.error("[IDENTIFY] Stack:", err.stack);
    }
    
    const errorMessage = err instanceof Error ? err.message : 'Image identification failed';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        predictions: []
      }, 
      { status: 500 }
    );
  }
}