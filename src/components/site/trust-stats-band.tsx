import { Clock, Globe, PhoneOff, UserCheck } from "lucide-react";

const stats = [
  {
    id: "availability",
    icon: Clock,
    label: "24/7 availability",
    detail: "nights, weekends, rush hour — someone's still picking up.",
  },
  {
    id: "languages",
    icon: Globe,
    label: "17+ languages",
    detail: "callers hear your desk in their language.",
  },
  {
    id: "concurrent",
    icon: PhoneOff,
    label: "zero busy signal",
    detail: "three lines ringing? nobody hears a busy tone.",
  },
  {
    id: "handoff",
    icon: UserCheck,
    label: "warm handoff",
    detail: "your team gets full context — no repeat-yourself moment.",
  },
] as const;

export function TrustStatsBand() {
  return (
    <section className="trust-stats-band" aria-label="Product highlights">
      <div className="trust-stats-band__inner site-container">
        <dl className="trust-stats-band__grid">
          {stats.map(({ id, icon: Icon, label, detail }) => (
            <div key={id} className="trust-stats-band__item">
              <dt className="trust-stats-band__term">
                <Icon className="trust-stats-band__icon" aria-hidden strokeWidth={1.75} />
                {label}
              </dt>
              <dd className="trust-stats-band__detail">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
