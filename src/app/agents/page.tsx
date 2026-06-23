import type { Metadata } from "next";

import { HarveyAgentHero } from "@/components/site/harvey-agent-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "agents — agentomatic",
  description:
    "purpose-built voice agents that answer, qualify, schedule, and hand off — end to end.",
  path: "/agents",
});

export default function AgentsPage() {
  return <HarveyAgentHero />;
}
