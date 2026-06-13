import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { commentText, ruleContext } = await req.json();
    
    if (!commentText) {
      return NextResponse.json({ error: "commentText is required" }, { status: 400 });
    }

    const reply = await generateReply(commentText, ruleContext || "be friendly");
    return NextResponse.json({ replyText: reply });
  } catch (error) {
    console.error("API Error generating comment reply:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
