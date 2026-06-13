import { NextRequest, NextResponse } from "next/server";
import { generateCaption } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt, platform } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const suggestions = await generateCaption(prompt, platform || "instagram");
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("API Error generating AI caption:", error);
    return NextResponse.json({ error: "Failed to generate caption suggestions" }, { status: 500 });
  }
}
