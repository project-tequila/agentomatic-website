import { NextResponse } from "next/server";

import { clientIpFromHeaders, demoWebVoiceLimiter } from "@/lib/ip-rate-limit";
import { isDemoWebVoiceJsonContentType, parseDemoWebVoicePost } from "@/lib/voice-languages";
import { mintDemoWebVoiceSession } from "@/lib/voice-gateway";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.DEMO_WEB_VOICE_ENABLED !== "true") {
    return NextResponse.json({ error: "Demo web voice is disabled" }, { status: 503 });
  }

  const ip = clientIpFromHeaders(request.headers);
  if (!demoWebVoiceLimiter.tryConsume(ip)) {
    return NextResponse.json(
      { error: "Too many demo voice sessions from this network. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type");
  let body: unknown;
  if (isDemoWebVoiceJsonContentType(contentType)) {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
  }

  const parsed = parseDemoWebVoicePost({ contentType, body });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await mintDemoWebVoiceSession({
      language: parsed.language,
      speechPath: parsed.speechPath,
    });
    return NextResponse.json({
      ws_url: result.ws_url,
      tenant_id: result.tenant_id,
      expires_in: result.expires_in,
      session_max_seconds: result.session_max_seconds,
      language: result.language,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start the demo voice session.";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
