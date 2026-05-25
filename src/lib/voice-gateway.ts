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
  detail?: string;
};

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

  const data = (await response.json().catch(() => ({}))) as DemoOutboundGatewayResult;
  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((item) => JSON.stringify(item)).join("; ")
          : data.message;
    throw new Error(detail || `Gateway returned ${response.status}`);
  }
  return data;
}
