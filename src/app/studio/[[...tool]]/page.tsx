"use client";

import Link from "next/link";
import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

function StudioNotConfigured() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="font-serif text-2xl text-foreground">Sanity is not configured</h1>
        <p className="text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
          and <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SANITY_DATASET</code> in
          your deployment environment, then redeploy. For Vercel, add them under Project Settings →
          Environment Variables for Production.
        </p>
        <p className="text-xs text-muted-foreground">
          After deploy, allow <code className="rounded bg-muted px-1 py-0.5">https://www.agentomatic.in</code>{" "}
          in your Sanity project CORS settings.
        </p>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to site
        </Link>
      </div>
    </main>
  );
}

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return <StudioNotConfigured />;
  }

  return <NextStudio config={config} />;
}
