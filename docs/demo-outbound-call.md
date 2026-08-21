# Public demo outbound calls

Visitors on the marketing site can request a live voice-agent call with **no login**. They only enter a phone number in **E.164** format (country code with `+`).

## Flow

1. Browser → `POST /api/demo/outbound-call` with `{ "phone": "+1..." }`
2. Next.js server → API gateway → AI service `POST /api/v1/ai/demo/outbound-call`
3. AI service places an outbound call via Twilio/Exotel using the configured demo tenant

Authentication is **not** required for visitors. Abuse is limited by a **server-only** shared secret (`DEMO_OUTBOUND_API_KEY`) sent as `X-Demo-Api-Key` from the Next.js route to the gateway.

In-browser mic demo (no phone): [demo-web-voice.md](./demo-web-voice.md).

## Environment variables (agentomatic-next)

Copy [`.env.example`](../.env.example) to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `API_GATEWAY_URL` | No (has default) | `https://gateway-production-56d3.up.railway.app` |
| `DEMO_OUTBOUND_API_KEY` | **Yes** | Same value as on the Railway **AI service** |
| `DEMO_VOICE_PROVIDER` | No | `twilio` or `exotel` (default from AI service) |
| `DEMO_VOICE_MESSAGE` | No | Optional greeting override |

Set the same variables on **Vercel** for production.

## Environment variables (Railway — AI service)

On the `ai_service` deployment in `appointment-booker-n8n`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DEMO_OUTBOUND_API_KEY` | **Yes** | Must match agentomatic-next |
| `DEMO_VOICE_TENANT_ID` | **Yes** | Supabase user UUID with **enabled** voice agent settings |
| `VOICE_STREAM_BASE_URL` | **Yes** | Public HTTPS URL of the AI service (telephony webhooks) |
| Twilio/Exotel keys | **Yes** | Same as dashboard test calls |

After changing env vars, **redeploy the AI service** so `POST /api/v1/ai/demo/outbound-call` is available.

## Verify

```bash
# Gateway + AI health
curl -s https://gateway-production-56d3.up.railway.app/api/v1/ai/health

# Demo call (replace key and number)
curl -s -X POST https://gateway-production-56d3.up.railway.app/api/v1/ai/demo/outbound-call \
  -H "Content-Type: application/json" \
  -H "X-Demo-Api-Key: YOUR_KEY" \
  -d '{"to_phone_number":"+1YOUR_NUMBER"}'
```

Expected success: `"status":"initiated"` and a `call_id`.
