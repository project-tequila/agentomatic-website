"use client";

import Link from "next/link";
import { useEffect } from "react";

type StudioError = Error & {
  addOriginUrl?: URL;
  projectId?: string;
};

function isCorsOriginError(error: StudioError): boolean {
  return error.name === "CorsOriginError";
}

export default function StudioError({
  error,
  reset,
}: {
  error: StudioError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isCorsOriginError(error)) {
    const manageUrl =
      error.addOriginUrl?.toString() ??
      "https://www.sanity.io/manage/project/1urzpjii/api?cors=add&origin=http%3A%2F%2Flocalhost%3A3000&credentials=";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg space-y-4 text-center">
          <h1 className="font-serif text-2xl text-foreground">
            Allow this site in Sanity CORS
          </h1>
          <p className="text-sm text-muted-foreground">
            The CMS studio runs on your Next.js dev server. Sanity blocks it until
            this origin is added to your project&apos;s CORS allowlist with{" "}
            <strong>Allow credentials</strong> enabled.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={manageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Add origin in Sanity
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Or run{" "}
            <code className="rounded bg-muted px-1 py-0.5">npm run sanity:cors</code>{" "}
            after{" "}
            <code className="rounded bg-muted px-1 py-0.5">npm run sanity:login</code>
            .
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to site
          </Link>
        </div>
      </main>
    );
  }

  const isMissingProjectId = error.message.includes("projectId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="font-serif text-2xl text-foreground">
          {isMissingProjectId ? "Sanity is not configured" : "CMS studio failed to load"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isMissingProjectId
            ? "Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to your Vercel project, redeploy, then allow https://www.agentomatic.in in Sanity CORS."
            : error.message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
