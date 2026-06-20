import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, isSanityConfigured, projectId } from "@/sanity/env";
import type { SanityCoverImage } from "@/sanity/queries";

export function urlForImage(source: SanityCoverImage) {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured.");
  }

  return createImageUrlBuilder({ projectId, dataset }).image(source);
}
