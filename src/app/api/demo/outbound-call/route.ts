import { NextResponse } from "next/server";

import { normalizeToE164 } from "@/lib/phone";
import { placeDemoOutboundCall } from "@/lib/voice-gateway";

export const runtime = "nodejs";

type OutboundCallBody = {
  phone?: string;
};

export async function POST(request: Request) {
  let body: OutboundCallBody;
  try {
    body = (await request.json()) as OutboundCallBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const phone = normalizeToE164(body.phone ?? "");
  if (!phone) {
    return NextResponse.json(
      {
        error: "Enter your number with country code, starting with + (e.g. +14155552671).",
      },
      { status: 400 },
    );
  }

  try {
    const result = await placeDemoOutboundCall({
      toPhoneNumber: phone,
      provider: process.env.DEMO_VOICE_PROVIDER?.trim() || undefined,
      message: process.env.DEMO_VOICE_MESSAGE?.trim() || undefined,
    });

    return NextResponse.json({
      call_id: result.call_id,
      message:
        result.message ||
        "Calling you now. Answer when your phone rings to connect to the voice agent.",
      status: result.status,
      provider: result.provider,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start the demo call.";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
