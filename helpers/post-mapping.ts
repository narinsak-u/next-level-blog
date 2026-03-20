import type { QueryDataSourceResponse } from "@notionhq/client/build/src/api-endpoints";
import { defaultImage } from "@/site/data";
import { PageDataSchema } from "@/types";

type NotionPage = QueryDataSourceResponse["results"][number];

const DEFAULT_DATE = "2023-07-27T17:12:00.000Z";
const DEFAULT_DESCRIPTION = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit, voluptatum nesciunt assumenda accusamus eius rem?";

type PageWithTimestamps = {
  id: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: Record<string, unknown>;
  cover?: { external?: { url: string }; file?: { url: string } };
  created_by?: { id: string };
  last_edited_by?: { id: string };
  icon?: { emoji?: string };
};

export const postMapping = (data: NotionPage[]) => {
  try {
    if (!data.length) return [];

    return data.map((page: NotionPage) => {
      const pageWithTimestamps = page as unknown as PageWithTimestamps;
      const properties = pageWithTimestamps.properties ?? {};
      const titleProperty = properties.Name as { title?: Array<{ plain_text?: string }> } | undefined;
      const descProperty = properties.Description as { rich_text?: Array<{ plain_text?: string }> } | undefined;
      const tagsProperty = properties.Tags as { multi_select?: Array<{ id: string; name: string; color: string }> } | undefined;
      const categoryProperty = properties.Category as { select?: { name?: string } } | undefined;

      const post = {
        id: page.id,
        title: titleProperty?.title?.[0]?.plain_text ?? "title",
        createdTime: pageWithTimestamps.created_time ?? DEFAULT_DATE,
        lastUpdated: pageWithTimestamps.last_edited_time ?? DEFAULT_DATE,
        tags: tagsProperty?.multi_select ?? [],
        description: descProperty?.rich_text?.[0]?.plain_text ?? DEFAULT_DESCRIPTION,
        coverImage: pageWithTimestamps.cover?.external?.url 
          ?? pageWithTimestamps.cover?.file?.url 
          ?? defaultImage,
        authorId: pageWithTimestamps.created_by?.id ?? "",
        lastEditedBy: pageWithTimestamps.last_edited_by?.id ?? "",
        icon: pageWithTimestamps.icon?.emoji ?? "",
        category: categoryProperty?.select?.name ?? "",
      };

      return PageDataSchema.parse(post);
    });
  } catch (error) {
    console.error("Validation error:", error);
    return [];
  }
};
