import { NextResponse } from "next/server";

import { clientIpFromHeaders, demoWebVoiceLimiter } from "@/lib/ip-rate-limit";
import { mintDemoWebVoiceSession } from "@/lib/voice-gateway";

export const runtime = "nodejs";

type WebVoiceBody = {
  language?: string;
};

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!demoWebVoiceLimiter.tryConsume(ip)) {
    return NextResponse.json(
      { error: "Too many demo voice sessions from this network. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let language: string | undefined;
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as WebVoiceBody;
      if (typeof body.language === "string" && body.language.trim()) {
        language = body.language.trim();
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
  }

  try {
    const result = await mintDemoWebVoiceSession({ language });
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
