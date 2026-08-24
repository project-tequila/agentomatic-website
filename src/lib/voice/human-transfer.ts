/**
 * Shared contract for web_demo / live-voice human transfer signals.
 *
 * The voice WebSocket emits this JSON when Twilio starts, completes, or fails
 * a human dial from `web_demo`. The browser only renders these live events —
 * never a fake “we will call you” success.
 *
 * Canonical payload:
 * `{ "type": "human_transfer", "status": "transferring" | "connected" | "failed" }`
 *
 * Also accepted: `event: "human_transfer"`, `state` instead of `status`,
 * and aliases `connecting` → transferring, `success` → connected,
 * `error` / `failure` → failed.
 */

export const HUMAN_TRANSFER_EVENT_TYPE = "human_transfer";

export type HumanTransferStatus = "transferring" | "connected" | "failed";

export type HumanTransferEvent = {
  type: typeof HUMAN_TRANSFER_EVENT_TYPE;
  status: HumanTransferStatus;
  message?: string;
};

const STATUS_ALIASES: Record<string, HumanTransferStatus> = {
  transferring: "transferring",
  connecting: "transferring",
  in_progress: "transferring",
  connected: "connected",
  success: "connected",
  completed: "connected",
  failed: "failed",
  error: "failed",
  failure: "failed",
};

/**
 * Normalize a WS status/state string to the three UI statuses.
 */
export function normalizeHumanTransferStatus(
  value: unknown,
): HumanTransferStatus | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  return STATUS_ALIASES[value.trim().toLowerCase()] ?? null;
}

function isHumanTransferEnvelope(record: Record<string, unknown>): boolean {
  const typeValue = record.type;
  const eventValue = record.event;
  return (
    typeValue === HUMAN_TRANSFER_EVENT_TYPE ||
    eventValue === HUMAN_TRANSFER_EVENT_TYPE
  );
}

/**
 * Parse a voice WebSocket JSON object into a human-transfer event, or null.
 */
export function parseHumanTransferEvent(
  payload: unknown,
): HumanTransferEvent | null {
  if (payload === null || typeof payload !== "object") {
    return null;
  }
  const record = payload as Record<string, unknown>;
  if (!isHumanTransferEnvelope(record)) {
    return null;
  }
  const status = normalizeHumanTransferStatus(
    record.status ?? record.state ?? record.phase,
  );
  if (!status) {
    return null;
  }
  const message =
    typeof record.message === "string" && record.message.trim().length > 0
      ? record.message.trim()
      : undefined;
  return message
    ? {
        type: HUMAN_TRANSFER_EVENT_TYPE,
        status,
        message,
      }
    : {
        type: HUMAN_TRANSFER_EVENT_TYPE,
        status,
      };
}
