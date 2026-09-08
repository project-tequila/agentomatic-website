const DEFAULT_GATEWAY_URL = "https://gateway-production-56d3.up.railway.app";

export function getApiGatewayBaseUrl(): string {
  const raw = process.env.API_GATEWAY_URL?.trim() || DEFAULT_GATEWAY_URL;
  const trimmed = raw.replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}


export function getDemoWebVoiceSessionUrl(): string {
  return `${getApiGatewayBaseUrl()}/api/v1/ai/demo/web-voice-session`;
}

export type DemoWebVoiceSessionResult = {
  ws_url: string;
  tenant_id: string;
  expires_in: number;
  session_max_seconds: number;
  language: string;
};

export type DemoOutboundGatewayResult = {
  call_id?: string;
  provider_call_sid?: string;
  status?: string;
  provider?: string;
  message?: string;
  from_number?: string;
  to_number?: string;
};

type GatewayErrorBody = {
  detail?: string | unknown[];
  message?: string;
};

function formatGatewayError(data: GatewayErrorBody, status: number): string {
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => JSON.stringify(item)).join("; ");
  }
  if (data.message) return data.message;
  return `Gateway returned ${status}`;
}

/**
 * Place a demo outbound call via the API gateway → AI voice service.
 */
export async function placeDemoOutboundCall(params: {
  toPhoneNumber: string;
  provider?: string;
  message?: string;
  language?: string;
}): Promise<DemoOutboundGatewayResult> {
  const apiKey = process.env.DEMO_OUTBOUND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Demo outbound is not configured (missing DEMO_OUTBOUND_API_KEY).");
  }

  const gatewayUrl = `${getApiGatewayBaseUrl()}/api/v1/ai/demo/outbound-call`;
  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-Api-Key": apiKey,
    },
    body: JSON.stringify({
      to_phone_number: params.toPhoneNumber,
      provider: params.provider,
      message: params.message,
      language: params.language,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as DemoOutboundGatewayResult & GatewayErrorBody;
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Demo call endpoint not found on the API gateway. Deploy the latest AI service (appointment-booker) with POST /api/v1/ai/demo/outbound-call and set DEMO_VOICE_TENANT_ID on Railway.",
      );
    }
    throw new Error(formatGatewayError(data, response.status));
  }
  return data;
}

/**
 * Mint a short-lived in-browser demo voice WebSocket session (no login, no phone).
 */
export async function mintDemoWebVoiceSession(params?: {
  language?: string;
}): Promise<DemoWebVoiceSessionResult> {
  if (process.env.DEMO_WEB_VOICE_ENABLED !== "true") {
    throw new Error("Demo web voice is disabled (set DEMO_WEB_VOICE_ENABLED=true).");
  }

  const apiKey = process.env.DEMO_OUTBOUND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Demo web voice is not configured (missing DEMO_OUTBOUND_API_KEY).");
  }

  const gatewayUrl = getDemoWebVoiceSessionUrl();
  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-Api-Key": apiKey,
    },
    body: JSON.stringify({
      language: params?.language,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as DemoWebVoiceSessionResult & GatewayErrorBody;
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Demo web voice endpoint not found on the API gateway. Deploy the latest AI service (appointment-booker) with POST /api/v1/ai/demo/web-voice-session and set DEMO_VOICE_TENANT_ID plus VOICE_STREAM_BASE_URL on Railway.",
      );
    }
    throw new Error(formatGatewayError(data, response.status));
  }
  return {
    ws_url: data.ws_url,
    tenant_id: data.tenant_id,
    expires_in: data.expires_in,
    session_max_seconds: data.session_max_seconds,
    language: data.language,
  };
}
