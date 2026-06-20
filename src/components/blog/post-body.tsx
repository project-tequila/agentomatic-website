import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { urlForImage } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="site-blog-prose__heading mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="site-blog-prose__subheading mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="site-blog-prose__quote">{children}</blockquote>
    ),
    normal: ({ children }) => (
      <p className="site-blog-prose__paragraph">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="site-blog-prose__list site-blog-prose__list--bullet">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="site-blog-prose__list site-blog-prose__list--number">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");

      return (
        <a
          href={href}
          className="site-link underline-offset-4 hover:underline"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const imageUrl = urlForImage(value).width(1200).auto("format").url();

      return (
        <figure className="site-blog-prose__figure">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="h-auto w-full"
          />
          {value.alt ? (
            <figcaption className="site-blog-prose__caption">{value.alt}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="site-blog-prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
