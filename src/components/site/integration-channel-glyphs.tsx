/** Icons are drawn in a 48×48 box centered on origin — ~50% of the r=48 hub circle. */
const ICON = 48;
const HALF = ICON / 2;

type PremiumChannelGlyphProps = {
  id: string;
  color: string;
  uid: string;
};

export function PremiumChannelGlyph({ id, color, uid }: PremiumChannelGlyphProps) {
  if (id === "phone") return <PhonePremium color={color} uid={uid} />;
  if (id === "whatsapp") return <WhatsAppPremium color={color} uid={uid} />;
  if (id === "email") return <EmailPremium color={color} uid={uid} />;
  if (id === "database") return <DatabasePremium color={color} uid={uid} />;
  return <CalendarPremium color={color} uid={uid} />;
}

function PhonePremium({ color, uid }: { color: string; uid: string }) {
  return (
    <g transform={`translate(${-HALF} ${-HALF})`}>
      <defs>
        <linearGradient id={`phoneGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.46 19.46 0 01-6-6 19.86 19.86 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        fill="rgba(18,20,24,0.8)"
        stroke={`url(#phoneGrad-${uid})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0 2) scale(1.72)"
      />
    </g>
  );
}

function WhatsAppPremium({ color, uid }: { color: string; uid: string }) {
  return (
    <g transform={`translate(${-HALF} ${-HALF})`}>
      <defs>
        <linearGradient id={`waGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <circle cx={HALF} cy={HALF} r="22" fill={`url(#waGrad-${uid})`} opacity="0.95" />
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        fill="#f5f2eb"
        transform={`translate(${HALF - 12} ${HALF - 12}) scale(1.05)`}
      />
    </g>
  );
}

function EmailPremium({ color, uid }: { color: string; uid: string }) {
  return (
    <g transform={`translate(${-HALF} ${-HALF})`}>
      <defs>
        <linearGradient id={`mailGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="28" rx="4" fill="rgba(18,20,24,0.9)" stroke={`url(#mailGrad-${uid})`} strokeWidth="2.2" />
      <path d="M4 14 L24 28 L44 14" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M4 14 L24 28 L44 14 V38 H4 Z" fill={color} opacity="0.14" />
      <path d="M10 34 L24 22 L38 34" fill="none" stroke={color} strokeWidth="1.4" opacity="0.4" />
    </g>
  );
}

function DatabasePremium({ color, uid }: { color: string; uid: string }) {
  return (
    <g transform={`translate(${-HALF} ${-HALF})`}>
      <defs>
        <linearGradient id={`dbGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <ellipse cx={HALF} cy={16} rx={14} ry={5} fill="none" stroke={`url(#dbGrad-${uid})`} strokeWidth="2.2" />
      <path
        d={`M${HALF - 14} 16 V30 C${HALF - 14} 35 ${HALF + 14} 35 ${HALF + 14} 30 V16`}
        fill="rgba(18,20,24,0.9)"
        stroke={`url(#dbGrad-${uid})`}
        strokeWidth="2.2"
      />
      <ellipse cx={HALF} cy={22} rx={14} ry={5} fill="none" stroke={color} strokeWidth="1.6" opacity="0.75" />
      <ellipse cx={HALF} cy={28} rx={14} ry={5} fill="none" stroke={color} strokeWidth="1.4" opacity="0.55" />
      <line x1={HALF - 14} y1={22} x2={HALF + 14} y2={22} stroke={color} strokeWidth="1.2" opacity="0.45" />
      <line x1={HALF - 14} y1={28} x2={HALF + 14} y2={28} stroke={color} strokeWidth="1.2" opacity="0.35" />
    </g>
  );
}

function CalendarPremium({ color, uid }: { color: string; uid: string }) {
  return (
    <g transform={`translate(${-HALF} ${-HALF})`}>
      <defs>
        <linearGradient id={`calGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="34" rx="4.5" fill="rgba(18,20,24,0.9)" stroke={`url(#calGrad-${uid})`} strokeWidth="2.2" />
      <rect x="4" y="8" width="40" height="11" rx="4.5" fill={color} opacity="0.88" />
      <rect x="4" y="17" width="40" height="2.5" fill={color} opacity="0.35" />
      <path d="M14 4 V12 M34 4 V12" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={10 + col * 10}
            y={22 + row * 7}
            width="6.5"
            height="4.5"
            rx="1"
            fill={color}
            opacity={row === 0 && col === 1 ? 0.95 : 0.32}
          />
        )),
      )}
    </g>
  );
}
