import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().min(8).max(120),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      description: "Click Generate after typing the title.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "content",
      description: "Turn on when the article is ready to appear on the website.",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      group: "content",
      initialValue: "Agentomatic Team",
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      group: "content",
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Topics",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "AI agents", value: "ai-agents" },
          { title: "Automation", value: "automation" },
          { title: "Product updates", value: "product-updates" },
          { title: "Engineering", value: "engineering" },
          { title: "Company news", value: "company-news" },
          { title: "Tutorials", value: "tutorials" },
        ],
        layout: "tags",
      },
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      group: "seo",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "authorName",
      media: "coverImage",
      published: "published",
    },
    prepare({ title, subtitle, media, published }) {
      return {
        title,
        subtitle: published ? subtitle : `${subtitle} · Draft`,
        media,
      };
    },
  },
});
