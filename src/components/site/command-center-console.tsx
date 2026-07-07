"use client";

import {
  Calendar,
  CalendarCheck,
  ClipboardList,
  Database,
  MessageCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { LiveAgentConsole, type LiveAgentConsoleScenario } from "@/components/site/live-agent-console";
import { cn } from "@/lib/utils";

const COMMAND_CENTER_CONSOLE_AGENT_LABEL = "ops agent";
const COMMAND_CENTER_CONSOLE_STATUS_LABEL = "live thread";

const COMMAND_CENTER_SCENARIOS: LiveAgentConsoleScenario[] = [
  {
    id: "calendar",
    label: "calendar",
    goalText: "block my calendar 2–4pm",
    steps: [
      {
        title: "read command",
        think: "parsing manager message in the thread…",
        detail: "intent: hold 2–4pm on the connected calendar",
        icon: Sparkles,
      },
      {
        title: "check conflicts",
        think: "scanning connected calendars for conflicts…",
        detail: "2–4pm is open · no double-bookings",
        icon: Calendar,
      },
      {
        title: "apply hold",
        think: "blocking the slot across connected calendars…",
        detail: "hold applied to primary calendar",
        icon: CalendarCheck,
      },
      {
        title: "confirm in thread",
        think: "writing confirmation back to the thread…",
        detail: "2–4pm blocked · team notified",
        icon: ClipboardList,
      },
    ],
    summary:
      "Blocked 2–4pm on the connected calendar and posted confirmation to the ops thread.",
  },
  {
    id: "reviews",
    label: "reviews",
    goalText: "gather reviews from today",
    steps: [
      {
        title: "read command",
        think: "parsing review request…",
        detail: "intent: ask today's completed visits for a review",
        icon: Sparkles,
      },
      {
        title: "find completed jobs",
        think: "pulling today's finished appointments…",
        detail: "6 visits completed · eligible for review",
        icon: CalendarCheck,
      },
      {
        title: "send requests",
        think: "sending review links via text…",
        detail: "6 review requests queued",
        icon: MessageCircle,
      },
      {
        title: "log responses",
        think: "tracking replies in the thread…",
        detail: "2 reviews already in · 4 pending",
        icon: ClipboardList,
      },
    ],
    summary:
      "Sent 6 review requests after today's visits and logged early responses in the ops thread.",
  },
  {
    id: "no-shows",
    label: "no-shows",
    goalText: "ping no-shows",
    steps: [
      {
        title: "read command",
        think: "parsing reminder request…",
        detail: "intent: nudge today's no-show appointments",
        icon: Sparkles,
      },
      {
        title: "find no-shows",
        think: "scanning today's schedule for missed visits…",
        detail: "2 no-shows flagged for follow-up",
        icon: MessageCircle,
      },
      {
        title: "send nudges",
        think: "sending whatsapp reminders with rebook links…",
        detail: "2 reminders queued via whatsapp",
        icon: PhoneCall,
      },
      {
        title: "confirm in thread",
        think: "posting delivery status to the thread…",
        detail: "2 nudges sent · 1 already replied",
        icon: ClipboardList,
      },
    ],
    summary:
      "Nudged 2 no-shows via WhatsApp and logged the first reply in the ops thread.",
  },
  {
    id: "brief",
    label: "brief",
    goalText: "morning ops brief",
    steps: [
      {
        title: "read command",
        think: "parsing morning brief request…",
        detail: "intent: sync today's bookings and risks",
        icon: Sparkles,
      },
      {
        title: "query systems",
        think: "pulling bookings, calendar, and queue…",
        detail: "12 bookings · 2 no-shows · 1 gap",
        icon: Database,
      },
      {
        title: "flag priorities",
        think: "ranking what needs attention first…",
        detail: "no-shows first · then waitlist fill",
        icon: ClipboardList,
      },
      {
        title: "post brief",
        think: "writing summary to the thread…",
        detail: "morning brief ready · 3 action items",
        icon: CalendarCheck,
      },
    ],
    summary:
      "Synced 12 bookings, flagged 2 no-shows and 1 open slot, and posted a morning brief to the ops thread.",
  },
];

type CommandCenterConsoleProps = {
  active: boolean;
  opacity: number;
  scenarioIndex?: number;
};

export function CommandCenterConsole({ active, opacity, scenarioIndex = 0 }: CommandCenterConsoleProps) {
  const safeIndex = Math.min(
    Math.max(0, scenarioIndex),
    COMMAND_CENTER_SCENARIOS.length - 1,
  );

  return (
    <div className="command-center-console-stack" style={{ opacity }}>
      {COMMAND_CENTER_SCENARIOS.map((scenario, index) => {
        const isActive = index === safeIndex;

        return (
          <LiveAgentConsole
            key={scenario.id}
            className={cn(
              "command-center-console",
              isActive && active && "command-center-console--visible",
            )}
            variant="harvey"
            active={active && isActive}
            agentLabel={COMMAND_CENTER_CONSOLE_AGENT_LABEL}
            avatarVariant="infinity-orb"
            statusLabel={COMMAND_CENTER_CONSOLE_STATUS_LABEL}
            scenarioBadge={`${index + 1} / ${COMMAND_CENTER_SCENARIOS.length} · ${scenario.label}`}
            goalText={scenario.goalText}
            steps={scenario.steps}
            summary={scenario.summary}
          />
        );
      })}
    </div>
  );
}
