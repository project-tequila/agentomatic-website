import type { Metadata } from "next";

import { BlogPostListItem } from "@/components/blog/post-list-item";
import { SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/sanity/fetch";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();

  return pageMetadata({
    title: "blog — agentomatic",
    description:
      "field notes on building voice agents people trust — scripts, qualification, and operational memory.",
    path: "/blog",
    robots: posts.length === 0 ? { index: false, follow: true } : undefined,
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="field notes"
          title="notes on building voices people trust."
          lead="practical writing on voice agents, qualification flows, and turning calls into memory."
        />

        {posts.length > 0 ? (
          <div className="site-blog-index site-divider-list mt-10">
            {posts.map((post) => (
              <BlogPostListItem key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="site-lead mt-10">no published notes yet — check back soon.</p>
        )}
      </SiteMain>
    </SitePageShell>
  );
}
