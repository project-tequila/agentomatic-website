"use client";

import {
  Calendar,
  Clock,
  GitBranch,
  LayoutDashboard,
  MessageCircle,
  PhoneCall,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const features = [
  { icon: PhoneCall, title: "Many calls at once", line: "Inbound & outbound" },
  { icon: Clock, title: "Always on", line: "24/7" },
  { icon: MessageCircle, title: "Smart reminders", line: "Fewer no-shows" },
  { icon: LayoutDashboard, title: "Ops dashboard", line: "Run it all" },
  { icon: Calendar, title: "Fits your stack", line: "Calendar · email · WhatsApp" },
  { icon: GitBranch, title: "Answers questions", line: "Instant replies" },
  { icon: Users, title: "Handoff to your team", line: "Warm, with context" },
] as const satisfies ReadonlyArray<{ icon: LucideIcon; title: string; line: string }>;

export function VoiceFeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="site-3d__panel site-3d__panel--features">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease: [0.22, 0.7, 0.18, 1] }}
        className="site-3d__features-head"
      >
        <h2 className="site-3d__features-title">What it does.</h2>
      </motion.div>

      <div className="site-3d__features-grid">
        {features.map(({ icon: Icon, title, line }, index) => (
          <motion.article
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 0.7, 0.18, 1] }}
            className="site-3d__feature-card"
          >
            <Icon className="site-3d__feature-icon" strokeWidth={1.5} aria-hidden />
            <h3 className="site-3d__feature-title">{title}</h3>
            <p className="site-3d__feature-line">{line}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
