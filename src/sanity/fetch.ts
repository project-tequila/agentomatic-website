import { getSanityClient } from "@/sanity/client";
import type { PostDetail, PostListItem } from "@/sanity/queries";
import { postBySlugQuery, postSlugsQuery, postsQuery } from "@/sanity/queries";

export async function getPublishedPosts(): Promise<PostListItem[]> {
  const client = getSanityClient();
  if (!client) {
    return [];
  }

  return client.fetch<PostListItem[]>(postsQuery);
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) {
    return [];
  }

  return client.fetch<string[]>(postSlugsQuery);
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<PostDetail | null> {
  const client = getSanityClient();
  if (!client) {
    return null;
  }

  return client.fetch<PostDetail | null>(postBySlugQuery, { slug });
}
