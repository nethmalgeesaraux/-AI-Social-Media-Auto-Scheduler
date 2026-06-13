import { NextRequest, NextResponse } from "next/server";
import { getUploadSignature } from "@/lib/imagekit";

export async function GET(req: NextRequest) {
  try {
    const signatureParams = getUploadSignature();
    return NextResponse.json(signatureParams);
  } catch (error) {
    console.error("API Error creating ImageKit upload signature:", error);
    return NextResponse.json({ error: "Failed to generate authorization signature" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  return GET(req);
}
