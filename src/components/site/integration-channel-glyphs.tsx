/** Channel art lives in a ~52×52 box centered on origin — sized for the r=48 hub. */
const ICON = 52;
const HALF = ICON / 2;

const CHANNEL_ART: Record<"phone" | "whatsapp" | "email" | "calendar", string> = {
  phone: "/story/integrations/phone.png",
  whatsapp: "/story/integrations/whatsapp.png",
  email: "/story/integrations/email.png",
  calendar: "/story/integrations/calendar.png",
};

type PremiumChannelGlyphProps = {
  id: string;
  color: string;
  uid: string;
};

export function PremiumChannelGlyph({ id, color, uid }: PremiumChannelGlyphProps) {
  const art = CHANNEL_ART[id as keyof typeof CHANNEL_ART];
  if (art) {
    return (
      <StoryChannelArtIcon src={art} channelId={id as keyof typeof CHANNEL_ART} />
    );
  }
  if (id === "database") return <DatabasePremium color={color} uid={uid} />;
  return <StoryChannelArtIcon src={CHANNEL_ART.calendar} channelId="calendar" />;
}

export function StoryChannelArtIcon({
  src,
  size = ICON,
  channelId,
}: {
  src: string;
  size?: number;
  channelId: keyof typeof CHANNEL_ART;
}) {
  const half = size / 2;
  return (
    <image
      href={src}
      x={-half}
      y={-half}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={`integrations-scene__channel-art integrations-scene__channel-art--${channelId}`}
    />
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
