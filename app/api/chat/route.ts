import { NextRequest, NextResponse } from "next/server";
import { askQuestion } from "@/ai";

export async function POST(req: NextRequest) {
  try {
    const { question, style } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const result = await askQuestion(question, style || "beginner");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
