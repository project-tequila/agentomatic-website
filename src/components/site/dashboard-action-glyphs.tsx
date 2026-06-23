import type { DashboardQueueIcon } from "@/lib/story/dashboard-reveal";
import { cn } from "@/lib/utils";

import { PremiumChannelGlyph } from "./integration-channel-glyphs";

type DashboardActionGlyphProps = {
  icon: DashboardQueueIcon;
  color: string;
  active: number;
};

const GLYPH_SCALE = 0.38;

export function DashboardActionGlyph({ icon, color, active }: DashboardActionGlyphProps) {
  const lit = active > 0.35;
  const uid = `dash-${icon}`;

  return (
    <g opacity={0.32 + active * 0.68} className={cn(lit && "dashboard-scene__queue-item--live")}>
      <circle
        r={13}
        fill="rgba(18,20,24,0.95)"
        stroke={color}
        strokeWidth={lit ? 1.6 : 1.1}
      />
      <circle r={13} fill={color} opacity={lit ? 0.1 : 0.04} />
      <g transform={`scale(${GLYPH_SCALE})`} opacity={lit ? 0.95 : 0.62}>
        <PremiumChannelGlyph id={icon} color={color} uid={uid} />
      </g>
      {lit ? (
        <circle
          r={16}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.35 * active}
          className="dashboard-scene__queue-ring"
        />
      ) : null}
    </g>
  );
}
