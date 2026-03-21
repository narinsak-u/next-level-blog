"use server";

import { cache } from "react";
import { notion as officialClient } from "@/lib/notion-client";
import unofficialClient from "@/lib/notion-api";
import { PageDataSchema, PageDataSchemaType } from "@/types";
import { defaultImage } from "@/site/data";
import type { ExtendedRecordMap } from "notion-types";
import type { QueryDataSourceResponse } from "@notionhq/client/build/src/api-endpoints";

// --- Types & Constants ---
type NotionPage = QueryDataSourceResponse["results"][number];
const DEFAULT_POST_LIMIT = 6;
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

// --- Internal Mapping Logic ---
/**
 * Maps Notion database results to our clean application Post type.
 * Private to this module.
 */
const mapNotionResultsToPosts = (data: NotionPage[]): PageDataSchemaType[] => {
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
    console.error("Post validation error:", error);
    return [];
  }
};

// --- Exported Actions ---

/**
 * Fetches posts from Notion with optional filtering and pagination.
 */
export const fetchPosts = cache(async (options: {
  category?: string;
  limit?: number;
  page?: number;
  status?: string;
} = {}): Promise<PageDataSchemaType[]> => {
  const { category, limit = DEFAULT_POST_LIMIT, page = 1, status = "Done" } = options;

  const filters: any[] = [
    {
      property: "Status",
      status: { equals: status },
    }
  ];

  if (category) {
    filters.push({
      property: "Category",
      select: { equals: category },
    });
  }

  try {
    const response = await officialClient.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID as string,
      filter: filters.length > 1 ? { and: filters } : filters[0],
      sorts: [
        { timestamp: "created_time", direction: "descending" },
      ],
    } as any);

    const results = response.results;
    if (!results.length) return [];

    // Apply pagination manually since we're using dataSources.query
    const paginatedResults = results.slice((page - 1) * limit, page * limit);
    return mapNotionResultsToPosts(paginatedResults);
  } catch (error) {
    console.error("Failed to fetch posts from Notion:", error);
    return [];
  }
});

/**
 * Convenience wrapper to fetch all posts.
 */
export const fetchAllPosts = cache(async (): Promise<PageDataSchemaType[]> => {
  return fetchPosts({ limit: 100 }); // Reasonable upper bound for "all"
});

/**
 * Fetches a single post by its ID.
 */
export const fetchPostById = cache(async (postId: string): Promise<PageDataSchemaType | null> => {
  try {
    const response = await officialClient.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID as string,
      filter: {
        and: [
          { property: "id", rich_text: { equals: postId } },
          { property: "Status", status: { equals: "Done" } },
        ],
      },
    } as any);

    if (!response.results.length) return null;

    const [post] = mapNotionResultsToPosts(response.results);
    return post ?? null;
  } catch (error) {
    console.error(`Failed to fetch post by ID ${postId}:`, error);
    return null;
  }
});

/**
 * Fetches the high-fidelity content of a post using the unofficial Notion SDK.
 */
export const fetchPostContent = cache(async (pageId: string): Promise<ExtendedRecordMap | null> => {
  if (!pageId) return null;

  try {
    return await unofficialClient.getPage(pageId);
  } catch (error) {
    console.error(`Failed to fetch content for page ${pageId}:`, error);
    return null;
  }
});

/**
 * Fetches content for specific fixed pages (About, Notes, Projects).
 */
export const fetchStaticPageContent = cache(async (type: 'about' | 'note' | 'project'): Promise<ExtendedRecordMap | null> => {
  const envMap = {
    about: 'NOTION_ABOUT_PAGE_ID',
    note: 'NOTION_NOTE_PAGE_ID',
    project: 'NOTION_PROJECT_PAGE_ID'
  };

  const pageId = process.env[envMap[type]] as string;
  return fetchPostContent(pageId);
});
