import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const encodedMessage = encodeURIComponent(message);
    const response = await fetch(
      `https://apis.xcasper.space/api/ai/mistral?message=${encodedMessage}`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    
    let reply: string;
    
    if (contentType.includes("application/json")) {
      const data = await response.json();
      reply = data.result || data.message || data.response || data.answer || data.text || data.content || data.reply || (typeof data === "string" ? data : JSON.stringify(data));
    } else {
      reply = await response.text();
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Foxy is taking a nap. Please try again!" },
      { status: 500 }
    );
  }
}
