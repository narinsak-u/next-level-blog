import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { defaultImage } from "@/site/data";
import { PageDataSchema } from "@/types";

type NotionPage = QueryDatabaseResponse["results"][number];

const DEFAULT_DATE = "2023-07-27T17:12:00.000Z";
const DEFAULT_DESCRIPTION = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit, voluptatum nesciunt assumenda accusamus eius rem?";

export const postMapping = (data: NotionPage[]) => {
  try {
    if (!data.length) return [];

    return data.map((page: NotionPage) => {
      const properties = page as { properties?: Record<string, unknown> };
      const titleProperty = properties.properties?.Name as { title?: Array<{ plain_text?: string }> } | undefined;
      const descProperty = properties.properties?.Description as { rich_text?: Array<{ plain_text?: string }> } | undefined;
      const tagsProperty = properties.properties?.Tags as { multi_select?: Array<{ id: string; name: string; color: string }> } | undefined;
      const categoryProperty = properties.properties?.Category as { select?: { name?: string } } | undefined;

      const post = {
        id: page.id,
        title: titleProperty?.title?.[0]?.plain_text ?? "title",
        createdTime: page.created_time ?? DEFAULT_DATE,
        lastUpdated: page.last_edited_time ?? DEFAULT_DATE,
        tags: tagsProperty?.multi_select ?? [],
        description: descProperty?.rich_text?.[0]?.plain_text ?? DEFAULT_DESCRIPTION,
        coverImage: (page as { cover?: { external?: { url: string }; file?: { url: string } } }).cover?.external?.url 
          ?? (page as { cover?: { external?: { url: string }; file?: { url: string } } }).cover?.file?.url 
          ?? defaultImage,
        authorId: (page as { created_by?: { id: string } }).created_by?.id ?? "",
        lastEditedBy: (page as { last_edited_by?: { id: string } }).last_edited_by?.id ?? "",
        icon: (page as { icon?: { emoji?: string } }).icon?.emoji ?? "",
        category: categoryProperty?.select?.name ?? "",
      };

      return PageDataSchema.parse(post);
    });
  } catch (error) {
    console.error("Validation error:", error);
    return [];
  }
};
