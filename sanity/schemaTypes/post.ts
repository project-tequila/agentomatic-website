import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "strategy", title: "Strategy" },
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
      name: "funnelStage",
      title: "Funnel stage",
      type: "string",
      group: "strategy",
      description: "Where this post sits in the content funnel.",
      options: {
        list: [
          { title: "TOFU — Awareness", value: "tofu" },
          { title: "MOFU — Consideration", value: "mofu" },
          { title: "BOFU — Conversion", value: "bofu" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Content tags",
      type: "array",
      group: "strategy",
      description:
        "Strategy labels for planning future posts — audience, angle, format, and theme.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Problem awareness", value: "problem-awareness" },
          { title: "Founder story", value: "founder-story" },
          { title: "Field notes", value: "field-notes" },
          { title: "Invisible labour", value: "invisible-labour" },
          { title: "Missed calls (reframe)", value: "missed-calls-reframe" },
          { title: "Qualification", value: "qualification" },
          { title: "Warm handoff", value: "warm-handoff" },
          { title: "Call memory", value: "call-memory" },
          { title: "Local business", value: "local-business" },
          { title: "SMB / owner-operated", value: "smb" },
          { title: "Multi-sector", value: "multi-sector" },
          { title: "Voice agents", value: "voice-agents" },
          { title: "Trust & credibility", value: "trust" },
          { title: "How-to / practical", value: "how-to" },
          { title: "Case study", value: "case-study" },
          { title: "Product / feature", value: "product" },
          { title: "Objection handling", value: "objection-handling" },
          { title: "Industry pattern", value: "industry-pattern" },
          { title: "Comparison / alternatives", value: "comparison" },
          { title: "Engagement / debate", value: "engagement" },
          { title: "Conversion / demo", value: "conversion" },
        ],
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
      funnelStage: "funnelStage",
    },
    prepare({ title, subtitle, media, published, funnelStage }) {
      const stage = funnelStage ? funnelStage.toUpperCase() : "—";
      const status = published ? subtitle : `${subtitle} · Draft`;
      return {
        title,
        subtitle: `${status} · ${stage}`,
        media,
      };
    },
  },
});
