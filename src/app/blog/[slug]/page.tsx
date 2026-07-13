import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostBody } from "@/components/blog/post-body";
import { JsonLd } from "@/components/site/json-ld";
import { SiteMain } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { formatPostDate } from "@/lib/format-date";
import { articleJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";
import { getPublishedPostBySlug, getPublishedPostSlugs } from "@/sanity/fetch";
import { urlForImage } from "@/sanity/image";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "note not found — agentomatic" };
  }

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const ogImage = post.coverImage
    ? urlForImage(post.coverImage).width(1200).height(630).url()
    : undefined;

  return pageMetadata({
    title: `${title} — ${SITE_NAME}`,
    description,
    path: `/blog/${slug}`,
    twitterImages: ogImage ? [ogImage] : undefined,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: post.coverImage?.alt || post.title,
              },
            ],
          }
        : {}),
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1400).height(788).auto("format").url()
    : null;

  const ogImageUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1200).height(630).url()
    : undefined;

  return (
    <SitePageShell>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.seoDescription ?? post.excerpt,
          slug,
          publishedAt: post.publishedAt,
          authorName: post.authorName,
          imageUrl: ogImageUrl,
        })}
      />
      <SiteMain>
        <article className="site-blog-article w-full max-w-3xl">
          <div className="site-page-header">
            <p className="site-card__meta">
              <Link href="/blog" className="site-link hover:opacity-80">
                field notes
              </Link>
              <span aria-hidden> · </span>
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              {post.authorName ? (
                <>
                  <span aria-hidden> · </span>
                  <span>{post.authorName}</span>
                </>
              ) : null}
            </p>
            <h1 className="site-display mt-4">{post.title}</h1>
            {post.excerpt ? <p className="site-lead">{post.excerpt}</p> : null}
          </div>

          {coverUrl ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--rumik-surface-border)]">
              <Image
                src={coverUrl}
                alt={post.coverImage?.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div className="mt-10">
            <PostBody value={post.body} />
          </div>

          <div className="mt-12 border-t border-[var(--rumik-surface-border)] pt-8">
            <Link href="/blog" className="site-link text-sm hover:opacity-80">
              ← back to field notes
            </Link>
          </div>
        </article>
      </SiteMain>
    </SitePageShell>
  );
}
