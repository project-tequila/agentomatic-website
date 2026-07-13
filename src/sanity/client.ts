import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

const readToken = process.env.SANITY_API_READ_TOKEN;

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: Boolean(readToken),
      perspective: "published",
      token: readToken,
    });
  }

  return client;
}
