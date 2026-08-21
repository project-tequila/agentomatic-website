# Public in-browser demo voice (locked contract)

CTO lock — 2026-08-19. Implement against this shape. Do not invent a second agent or require booker login.

## Why

Phone-only “Call me” is high-friction. Homepage mic in `voice-experience.tsx` is fake (idle → listening → speaking). HUD is scroll-gated. Visitors do not interact.

## Flow

1. Visitor taps **Talk** (chrome / orb / HUD — reachable without finishing cinema scroll).
2. Browser `POST /api/demo/web-voice` (no API key in the client).
3. Next.js (server-only `DEMO_OUTBOUND_API_KEY`) → gateway `POST /api/v1/ai/demo/web-voice-session`.
4. AI service mints a short-lived token bound to `DEMO_VOICE_TENANT_ID` and returns a fully-qualified WebSocket URL.
5. Browser connects to that URL, streams 16 kHz PCM, plays TTS, barge-in unchanged.
6. **Call me** remains as fallback (mic denied / mobile Safari).

Gateway does **not** proxy WebSockets. Mint response **must** include the public `wss://` URL of the AI service (`VOICE_STREAM_BASE_URL`).

## HTTP — mint session

**AI service:** `POST /demo/web-voice-session` (gateway: `POST /api/v1/ai/demo/web-voice-session`)

Header: `X-Demo-Api-Key: <DEMO_OUTBOUND_API_KEY>` (reuse outbound secret; do not invent a second key unless the outbound key is missing).

Request:

```json
{ "language": "en" }
```

`language` optional. Default tenant language / `en`.

Success `200`:

```json
{
  "ws_url": "wss://<ai-public-host>/ws/demo-web-voice?token=<jwt>&language=en",
  "tenant_id": "<DEMO_VOICE_TENANT_ID>",
  "expires_in": 120,
  "session_max_seconds": 180,
  "language": "en"
}
```

Errors: `401` bad key, `503` missing `DEMO_VOICE_TENANT_ID` / `VOICE_STREAM_BASE_URL`, `429` if AI-side concurrency cap hit.

**Marketing site:** `POST /api/demo/web-voice`

- No phone / E.164.
- Secret never sent to the browser.
- IP rate limit: **5 sessions / 10 minutes** (in-memory is OK for this pass).
- Returns the JSON above (or `{ "error": "..." }`).

## WebSocket — demo channel

`GET /ws/demo-web-voice?token=...&language=en`

- Dedicated path (do **not** require Supabase on this path).
- Token: HMAC-signed, purpose `demo-web-voice`, tenant = `DEMO_VOICE_TENANT_ID` only, connect TTL **120s**, session max **180s** then close.
- Reuse `VoiceStreamHandler` + `WebAudioAdapter` (same frames as dashboard live voice).
- Existing `/ws/web-voice/{tenant_id}` stays Supabase-authed.

Token module (booker): `backend/services/ai_service/app/services/voice/demo_web_voice_token.py`

- `mint_demo_web_voice_token(...)` → `str`
- `verify_demo_web_voice_token(token) -> DemoWebVoiceClaims | None`

Sign with `DEMO_OUTBOUND_API_KEY`.

## CORS

Allow marketing origins on AI CORS: `https://www.agentomatic.in`, `https://agentomatic.in`, Vercel preview regex if already used. WS is cross-origin from the marketing site to the AI host.

## UI (website)

- Kill fake idle/listening/speaking cycle.
- Wire orb energy to real `status` / `isAgentSpeaking`.
- Compact live transcript (last ~4 lines).
- End button; mic-permission error copy; keep Call me.
- Talk available from chrome “Talk to Agent”, persistent orb hit, and HUD — not only `sceneProgress >= 0.78`.

## Out of scope

Replacing telephony. New LangGraph in this repo. Merge to master. Booker login on the marketing site.

## Founder env (do not invent values)

| Where | Var | Notes |
|-------|-----|--------|
| Vercel (website) | `DEMO_OUTBOUND_API_KEY`, `API_GATEWAY_URL` | Already used for Call me |
| Railway AI | `DEMO_OUTBOUND_API_KEY`, `DEMO_VOICE_TENANT_ID`, `VOICE_STREAM_BASE_URL`, `CORS_ORIGINS` | Redeploy after mint+WS land |

## Verify

Website route (secret stays on the Next.js server; do not send `X-Demo-Api-Key` from the browser):

```bash
# Local
curl -s -X POST http://localhost:3000/api/demo/web-voice \
  -H "Content-Type: application/json" \
  -d '{"language":"en"}'

# Production
curl -s -X POST https://www.agentomatic.in/api/demo/web-voice \
  -H "Content-Type: application/json" \
  -d '{"language":"en"}'
```

Expected success: JSON with `ws_url` (wss), `tenant_id`, `expires_in`, `session_max_seconds`, `language`. Missing `DEMO_OUTBOUND_API_KEY` on Vercel → `503`. Rate limit → `429`. Gateway/AI mint not deployed yet → `502` with a 404 helper message.

Gateway (same key as outbound; only for ops, not the marketing client):

```bash
curl -s -X POST https://gateway-production-56d3.up.railway.app/api/v1/ai/demo/web-voice-session \
  -H "Content-Type: application/json" \
  -H "X-Demo-Api-Key: YOUR_KEY" \
  -d '{"language":"en"}'
```

Until Diya’s AI mint is deployed, this path 404s. That is expected.
