import { getSanityClient } from "@/sanity/client";
import type { PostDetail, PostListItem, PostSitemapEntry } from "@/sanity/queries";
import {
  postBySlugQuery,
  postSitemapQuery,
  postSlugsQuery,
  postsQuery,
} from "@/sanity/queries";

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

  try {
    return await client.fetch<string[]>(postSlugsQuery);
  } catch (error) {
    console.error("[sanity] getPublishedPostSlugs failed", error);
    return [];
  }
}

export async function getPublishedPostsForSitemap(): Promise<PostSitemapEntry[]> {
  const client = getSanityClient();
  if (!client) {
    return [];
  }

  try {
    return await client.fetch<PostSitemapEntry[]>(postSitemapQuery);
  } catch (error) {
    console.error("[sanity] getPublishedPostsForSitemap failed", error);
    return [];
  }
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
