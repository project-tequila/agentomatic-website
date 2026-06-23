import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Agentomatic content")
    .items([
      S.listItem()
        .title("Blog posts")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Blog posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
    ]);
