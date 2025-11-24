import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

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

// Prediction type for identification results
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
    const res = await fetch(`https://api.inaturalist.org/v1/taxa?q=${q}&per_page=1`);
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // 2.0 or 1.5 Flash is recommended

    // UPDATED PROMPT WITH STRICT FILTERS
    const prompt = `
You are an expert in Philippine wildlife identification.

**STRICT FILTERING RULES:**
1. First, analyze the image to determine if it contains a **REAL, BIOLOGICAL ANIMAL**.
2. **IMMEDIATELY RETURN AN EMPTY ARRAY "[]"** if the image contains:
   - Humans (people, faces, body parts)
   - Cartoons, anime, drawings, sketches, or digital art
   - Inanimate objects (cars, furniture, toys, statues, figurines)
   - Plants, flowers, or scenery with no visible animal
   - Food or cooked dishes
3. Only proceed if the image contains a real living creature (Mammal, Bird, Reptile, Insect, Amphibian, Fish, Arachnid, etc.).

If it is a valid animal, provide the **Top 3 most likely species** found in the Philippines.

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

    return NextResponse.json({ predictions });
  } catch (err: unknown) {
    console.error("Error identifying image:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}