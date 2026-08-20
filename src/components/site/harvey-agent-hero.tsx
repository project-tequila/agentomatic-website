"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MULTILINGUAL_LANGUAGE_COUNT } from "@/lib/story/multilingual-reveal";
import {
  CalendarCheck,
  ClipboardList,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { LiveAgentConsole } from "@/components/site/live-agent-console";
import { cn } from "@/lib/utils";

const HARVEY_NAV_LINKS = [
  { href: "/about", label: "about" },
  { href: "/pricing", label: "pricing" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact us" },
] as const;
