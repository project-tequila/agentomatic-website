const DEFAULT_GATEWAY_URL = "https://gateway-production-56d3.up.railway.app";

export function getApiGatewayBaseUrl(): string {
  const raw = process.env.API_GATEWAY_URL?.trim() || DEFAULT_GATEWAY_URL;
  const trimmed = raw.replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

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
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as DemoOutboundGatewayResult & GatewayErrorBody;
  if (!response.ok) {
    throw new Error(formatGatewayError(data, response.status));
  }
  return data;
}
