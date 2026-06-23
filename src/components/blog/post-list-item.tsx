import Link from "next/link";

import { formatPostDate } from "@/lib/format-date";
import type { PostListItem } from "@/sanity/queries";

export function BlogPostListItem({ post }: { post: PostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="site-divider-list__item group">
      <div>
        <p className="site-card__meta">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          {post.authorName ? (
            <>
              <span aria-hidden> · </span>
              <span>{post.authorName}</span>
            </>
          ) : null}
        </p>
        <h2 className="site-card__title mt-1.5 group-hover:opacity-80">{post.title}</h2>
        {post.excerpt ? <p className="site-card__body mt-2">{post.excerpt}</p> : null}
      </div>
      <span className="site-card__meta hidden sm:block">read</span>
    </Link>
  );
}
