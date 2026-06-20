"use client";

import { CALL_THEME } from "@/lib/story/concurrent-reveal";
import { cn } from "@/lib/utils";

type RealisticPhoneSvgProps = {
  accent: string;
  highlight?: number;
  uid?: string;
  showRing?: boolean;
  variant?: "frontdesk" | "caller";
  callDirection?: "inbound" | "outbound";
  /** When true, accent strokes read from `--phone-accent` (for dual-mode color shift). */
  useAccentVar?: boolean;
  /** Icon + waveform only — no call labels. */
  minimal?: boolean;
  /** Incoming-call screen for minimal frontdesk (handset + answer button). */
  screenMode?: "default" | "incoming";
  /** Incoming-call ring animation on screen icon. */
  ringing?: boolean;
};

/** Smartphone — `frontdesk` = premium hero device; `caller` = background incoming calls. */
export function RealisticPhoneSvg({
  accent,
  highlight = 0.75,
  uid = "phone",
  showRing = false,
  variant = "caller",
  callDirection = "inbound",
  useAccentVar = false,
  minimal = false,
  screenMode = "default",
  ringing = false,
}: RealisticPhoneSvgProps) {
  const id = uid.replace(/[^a-zA-Z0-9_-]/g, "");
  const isFrontdesk = variant === "frontdesk";
  const isOutbound = callDirection === "outbound";
  const strokeAccent = useAccentVar ? "var(--phone-accent, #8cffd2)" : accent;
  const fillAccent = useAccentVar ? "var(--phone-accent, #8cffd2)" : accent;
  const glow = isFrontdesk ? 0.55 + highlight * 0.45 : 0.25 + highlight * 0.35;
  const bodyTop = isFrontdesk ? "#5a6270" : "#454b58";
  const bodyMid = isFrontdesk ? "#363c48" : "#2a2f3a";
  const bodyBot = isFrontdesk ? "#1a1e26" : "#14171d";

  return (
    <g className={cn(isFrontdesk ? "concurrent-scene__phone-art--frontdesk" : "concurrent-scene__phone-art--caller", useAccentVar && "concurrent-scene__phone-art--accent-var")}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bodyTop} />
          <stop offset="45%" stopColor={bodyMid} />
          <stop offset="100%" stopColor={bodyBot} />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isFrontdesk ? "#1a2230" : "#161922"} />
          <stop offset="100%" stopColor="#07080c" />
        </linearGradient>
        <linearGradient id={`${id}-glare`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isFrontdesk ? "0.18" : "0.1"} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {isFrontdesk ? (
          <radialGradient id={`${id}-heroGlow`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={isOutbound ? CALL_THEME.outbound.color : CALL_THEME.inbound.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={isOutbound ? CALL_THEME.outbound.color : CALL_THEME.inbound.color} stopOpacity="0" />
          </radialGradient>
        ) : null}
      </defs>

      {isFrontdesk ? <ellipse cx="32" cy="58" rx="28" ry="38" fill={`url(#${id}-heroGlow)`} className="concurrent-scene__phone-glow" /> : null}

      <ellipse
        cx="32"
        cy="114"
        rx={isFrontdesk ? 24 : 18}
        ry={isFrontdesk ? 4 : 2.5}
        fill="rgba(0,0,0,0.45)"
        opacity={isFrontdesk ? 0.55 + highlight * 0.35 : 0.3 + highlight * 0.25}
      />

      <rect
        x="1"
        y="1"
        width="62"
        height="112"
        rx="13"
        fill={`url(#${id}-body)`}
        stroke={isFrontdesk ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)"}
        strokeWidth={isFrontdesk ? 1.1 : 0.8}
      />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="111"
        rx="12.5"
        fill="none"
        stroke={strokeAccent}
        strokeWidth={isFrontdesk ? 2 : 1}
        opacity={isFrontdesk ? 0.75 + highlight * 0.25 : 0.35 + highlight * 0.3}
        className="concurrent-scene__phone-accent-stroke"
      />

      <rect x="0" y="26" width="1.5" height="12" rx="0.75" fill={isFrontdesk ? "#6b7280" : "#555b66"} />
      <rect x="0" y="42" width="1.5" height="16" rx="0.75" fill={isFrontdesk ? "#6b7280" : "#555b66"} />
      <rect x="62.5" y="34" width="1.5" height="20" rx="0.75" fill={isFrontdesk ? "#6b7280" : "#555b66"} />

      <rect x="5" y="8" width="54" height="98" rx="10" fill={`url(#${id}-screen)`} stroke="rgba(0,0,0,0.55)" strokeWidth="0.6" />

      <rect x="21" y="11" width="22" height="5.5" rx="2.75" fill="#050608" />
      {isFrontdesk ? (
        <circle cx="40" cy="13.75" r="1.4" fill={fillAccent} opacity="0.85" className="concurrent-scene__phone-accent-fill" />
      ) : (
        <circle cx="40" cy="13.75" r="1.1" fill="#1a2030" />
      )}

      {!minimal ? (
        <text x="10" y="24" fill="rgba(255,255,255,0.55)" fontSize="4.5" fontFamily="system-ui, sans-serif" fontWeight="500">
          9:41
        </text>
      ) : null}
      {[0, 1, 2, 3].map((b) => (
        <rect
          key={b}
          x={46 + b * 2.8}
          y={18 - (b % 2) * 1.5}
          width="1.8"
          height={3 + b * 1.2}
          rx="0.4"
          fill={isFrontdesk ? fillAccent : "rgba(255,255,255,0.45)"}
          opacity={isFrontdesk ? 0.85 : 1}
          className={isFrontdesk ? "concurrent-scene__phone-accent-fill" : undefined}
        />
      ))}

      {isFrontdesk ? (
        <>
          {!minimal ? (
            <>
              <rect x="8" y="28" width="48" height="10" rx="4" fill={fillAccent} fillOpacity="0.12" stroke={strokeAccent} strokeWidth="0.6" />
              <text x="32" y="35.5" textAnchor="middle" fill={fillAccent} fontSize="5.2" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
                frontdesk
              </text>
            </>
          ) : null}
          <circle cx="32" cy="52" r="13" fill={fillAccent} fillOpacity="0.18" className="concurrent-scene__phone-accent-fill" />
          <circle cx="32" cy="52" r="9" fill="#252932" stroke={strokeAccent} strokeWidth="1.1" className="concurrent-scene__phone-accent-stroke" />
          {isOutbound ? (
            <>
              <circle
                cx="32"
                cy="52"
                r="11.5"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1"
                opacity="0.35"
                className="concurrent-scene__out-pulse"
              />
              <path
                d="M27 52 L35 52 M35 52 L32.5 49 M35 52 L32.5 55"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="concurrent-scene__phone-accent-stroke"
              />
            </>
          ) : screenMode === "incoming" && minimal ? (
            <>
              <path
                d="M21 47 C21 40 26 35 32 35 C38 35 43 40 43 47"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1.1"
                opacity="0.45"
                className={cn("concurrent-scene__in-ring-arc", ringing && "concurrent-scene__in-ring-arc--live")}
              />
              <path
                d="M18 49 C18 38 24 31 32 31 C40 31 46 38 46 49"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="0.85"
                opacity="0.28"
                className={cn("concurrent-scene__in-ring-arc concurrent-scene__in-ring-arc--delayed", ringing && "concurrent-scene__in-ring-arc--live")}
              />
              <path
                d="M27 48 C27 43.5 37 43.5 37 48 C37 52 33 54 33 58 L31 58 C31 54 27 52 27 48 Z"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="concurrent-scene__phone-accent-stroke"
              />
              <circle cx="32" cy="88" r="7.5" fill="#16a34a" opacity={ringing ? 0.9 : 0.75} />
              <path
                d="M27.5 86 C27.5 83.2 36.5 83.2 36.5 86"
                fill="none"
                stroke="#ecfdf5"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.85"
              />
            </>
          ) : (
            <>
              <path
                d="M21 47 C21 40 26 35 32 35 C38 35 43 40 43 47"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1.1"
                opacity="0.45"
                className={cn("concurrent-scene__in-ring-arc", ringing && "concurrent-scene__in-ring-arc--live")}
              />
              <path
                d="M18 49 C18 38 24 31 32 31 C40 31 46 38 46 49"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="0.85"
                opacity="0.28"
                className={cn("concurrent-scene__in-ring-arc concurrent-scene__in-ring-arc--delayed", ringing && "concurrent-scene__in-ring-arc--live")}
              />
              <path
                d="M22 44 L28 50 M22 44 L25 44 M22 44 L22 47"
                fill="none"
                stroke={strokeAccent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="concurrent-scene__phone-accent-stroke"
              />
            </>
          )}
          {!(screenMode === "incoming" && minimal) ? (
          <g className={isOutbound ? "concurrent-scene__waveform concurrent-scene__waveform--outbound" : "concurrent-scene__waveform concurrent-scene__waveform--inbound"}>
            {[0, 1, 2, 3, 4].map((b) => (
              <rect
                key={b}
                x={20 + b * 5}
                y={82 - (b % 3) * 2}
                width="2.5"
                height={6 + (b % 3) * 4}
                rx="1"
                fill={fillAccent}
                opacity="0.75"
                className="concurrent-scene__phone-accent-fill"
              />
            ))}
          </g>
          ) : null}
        </>
      ) : isOutbound ? (
        <>
          <circle cx="32" cy="50" r="11" fill="#252932" stroke={strokeAccent} strokeWidth="0.7" opacity="0.88" />
          <circle cx="32" cy="46" r="4" fill="rgba(245,242,235,0.72)" />
          <path d="M25.5 57 Q32 51.5 38.5 57" fill="rgba(245,242,235,0.45)" />
          {!minimal ? (
            <>
              <text x="32" y="68" textAnchor="middle" fill="rgba(245,242,235,0.58)" fontSize="4.5" fontFamily="system-ui, sans-serif">
                dialing
              </text>
              <text x="32" y="74" textAnchor="middle" fill="rgba(245,242,235,0.32)" fontSize="3.8" fontFamily="system-ui, sans-serif">
                +1 (555) 0198
              </text>
            </>
          ) : null}
          <circle cx="32" cy="88" r="7.5" fill="#d97706" opacity="0.8" />
          <path d="M28 88 L36 88 M36 88 L33 85 M36 88 L33 91" fill="none" stroke="#fff7ed" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        </>
      ) : (
        <>
          <circle cx="32" cy="50" r="11" fill="#252932" stroke={strokeAccent} strokeWidth="0.7" opacity="0.88" />
          <circle cx="32" cy="46" r="4" fill="rgba(245,242,235,0.72)" />
          <path d="M25.5 57 Q32 51.5 38.5 57" fill="rgba(245,242,235,0.45)" />
          {!minimal ? (
            <>
              <text x="32" y="68" textAnchor="middle" fill="rgba(245,242,235,0.58)" fontSize="4.5" fontFamily="system-ui, sans-serif">
                incoming
              </text>
              <text x="32" y="74" textAnchor="middle" fill="rgba(245,242,235,0.32)" fontSize="3.8" fontFamily="system-ui, sans-serif">
                +1 (555) 0142
              </text>
            </>
          ) : null}
          <circle cx="32" cy="88" r="7.5" fill="#16a34a" opacity="0.75" />
          <path d="M27.5 86 C27.5 83.2 36.5 83.2 36.5 86" fill="none" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        </>
      )}

      <rect x="24" y="99" width="16" height="2.2" rx="1.1" fill={isFrontdesk ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.22)"} />

      <path d="M7 10 L18 10 L9 36 Z" fill={`url(#${id}-glare)`} opacity={glow} />

      {showRing && highlight > 0.45 ? (
        <>
          <circle
            cx="32"
            cy="58"
            r={isFrontdesk ? 38 : 30}
            fill="none"
            stroke={strokeAccent}
            strokeWidth={isFrontdesk ? 1.8 : 1}
            opacity={isFrontdesk ? 0.35 + highlight * 0.3 : 0.18 + highlight * 0.2}
            className={cn(isFrontdesk ? "concurrent-scene__hero-ring" : "concurrent-scene__ring", "concurrent-scene__phone-accent-stroke")}
          />
          {!isFrontdesk ? (
            <circle
              cx="32"
              cy="58"
              r="26"
              fill="none"
              stroke={strokeAccent}
              strokeWidth="0.8"
              opacity={0.12 + highlight * 0.15}
              className="concurrent-scene__ring concurrent-scene__ring--delayed concurrent-scene__phone-accent-stroke"
            />
          ) : null}
        </>
      ) : null}
    </g>
  );
}
