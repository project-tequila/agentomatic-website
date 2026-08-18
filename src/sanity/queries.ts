import type { PortableTextBlock } from "@portabletext/types";
import { groq } from "next-sanity";

export interface SanityCoverImage {
  asset?: { _ref: string };
  alt?: string;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  authorName: string;
  categories?: string[];
  coverImage?: SanityCoverImage;
}

export interface PostSitemapEntry {
  slug: string;
  _updatedAt: string;
}

export interface PostDetail extends PostListItem {
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  _updatedAt?: string;
}

export const postsQuery = groq`
  *[_type == "post" && published == true && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    authorName,
    categories,
    coverImage { ..., alt }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && published == true && defined(slug.current)][].slug.current
`;

export const postSitemapQuery = groq`
  *[_type == "post" && published == true && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && published == true && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    authorName,
    categories,
    coverImage { ..., alt },
    body,
    seoTitle,
    seoDescription
  }
`;
