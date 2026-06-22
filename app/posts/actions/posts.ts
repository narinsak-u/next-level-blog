"use server";

import { cache } from "react";
import { notion as officialClient } from "@/lib/notion-client";
import unofficialClient from "@/lib/notion-api";
import { PageDataSchema, PageDataSchemaType } from "@/types";
import { defaultImage } from "@/site/data";
import { DEFAULT_DATE, DEFAULT_DESCRIPTION } from "@/lib/constants";
import type { ExtendedRecordMap } from "notion-types";
import type { QueryDataSourceParameters } from "@notionhq/client/build/src/api-endpoints";

// --- Types & Constants ---
const DEFAULT_POST_LIMIT = 6;

interface PageWithTimestamps {
  id: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: PageProperty;
  cover?: { external?: { url: string }; file?: { url: string } } | null;
  created_by?: { id: string };
  last_edited_by?: { id: string };
  icon?: { emoji?: string } | null;
}

interface PageProperty {
  Name?: { title?: Array<{ plain_text?: string }> };
  Description?: { rich_text?: Array<{ plain_text?: string }> };
  Tags?: { multi_select?: Array<{ id: string; name: string; color: string }> };
  Category?: { select?: { name?: string } };
  Status?: { status?: { name?: string } };
}

// --- Internal Mapping Logic ---
/**
 * Maps Notion database results to our clean application Post type.
 * Private to this module.
 */
const mapNotionResultsToPosts = (data: unknown[]): PageDataSchemaType[] => {
  try {
    if (!data.length) return [];

    return data.map((page) => {
      const pageWithTimestamps = page as PageWithTimestamps;
      const properties = pageWithTimestamps.properties ?? ({} as PageProperty);
      const titleProperty = properties.Name;
      const descProperty = properties.Description;
      const tagsProperty = properties.Tags;
      const categoryProperty = properties.Category;

      const coverUrl =
        pageWithTimestamps.cover && typeof pageWithTimestamps.cover !== "string"
          ? ((
              pageWithTimestamps.cover as {
                external?: { url: string };
                file?: { url: string };
              }
            )?.external?.url ??
            (
              pageWithTimestamps.cover as {
                external?: { url: string };
                file?: { url: string };
              }
            )?.file?.url)
          : null;

      const iconEmoji =
        pageWithTimestamps.icon && typeof pageWithTimestamps.icon !== "string"
          ? ((pageWithTimestamps.icon as { emoji?: string })?.emoji ?? "")
          : "";

      const post = {
        id: pageWithTimestamps.id,
        title: titleProperty?.title?.[0]?.plain_text ?? "title",
        createdTime: pageWithTimestamps.created_time ?? DEFAULT_DATE,
        lastUpdated: pageWithTimestamps.last_edited_time ?? DEFAULT_DATE,
        tags: tagsProperty?.multi_select ?? [],
        description:
          descProperty?.rich_text?.[0]?.plain_text ?? DEFAULT_DESCRIPTION,
        coverImage: coverUrl ?? defaultImage,
        authorId: pageWithTimestamps.created_by?.id ?? "",
        lastEditedBy: pageWithTimestamps.last_edited_by?.id ?? "",
        icon: iconEmoji,
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
export const fetchPosts = cache(
  async (
    options: {
      category?: string;
      limit?: number;
      page?: number;
      status?: string;
    } = {},
  ): Promise<PageDataSchemaType[]> => {
    const {
      category,
      limit = DEFAULT_POST_LIMIT,
      page = 1,
      status = "Done",
    } = options;

    const statusFilter: QueryDataSourceParameters["filter"] = {
      property: "Status",
      status: { equals: status },
    };

    const categoryFilter: QueryDataSourceParameters["filter"] | null = category
      ? { property: "Category", select: { equals: category } }
      : null;

    const filter: QueryDataSourceParameters["filter"] = categoryFilter
      ? { and: [statusFilter, categoryFilter] }
      : statusFilter;

    try {
      const response = await officialClient.dataSources.query({
        data_source_id: process.env.NOTION_DATA_SOURCE_ID as string,
        filter,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });

      const results = response.results;
      if (!results.length) return [];

      // Apply pagination manually since we're using dataSources.query
      const paginatedResults = results.slice((page - 1) * limit, page * limit);
      return mapNotionResultsToPosts(paginatedResults);
    } catch (error) {
      console.error("Failed to fetch posts from Notion:", error);
      return [];
    }
  },
);

export const fetchPostDates = cache(
  async (): Promise<{
    dates: Record<string, number>;
    years: number[];
  }> => {
    try {
      const dataSourceId = process.env.NOTION_DATA_SOURCE_ID as string;
      console.log("fetchPostDates - Using data_source_id:", dataSourceId);

      const response = await officialClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Status",
          status: { equals: "Done" },
        },
        sorts: [{ timestamp: "created_time", direction: "ascending" }],
      });

      const results = response.results;
      console.log("fetchPostDates - Notion results count:", results.length);
      if (!results.length) return { dates: {}, years: [] };

      const dates: Record<string, number> = {};
      const yearsSet = new Set<number>();

      for (const page of results) {
        const pageWithTimestamps = page as PageWithTimestamps;
        const createdTime = pageWithTimestamps.created_time;
        if (createdTime) {
          const date = createdTime.split("T")[0];
          dates[date] = (dates[date] || 0) + 1;
          yearsSet.add(new Date(date).getFullYear());
        }
      }

      const years = Array.from(yearsSet).sort((a, b) => a - b);
      return { dates, years };
    } catch (error) {
      console.error("Failed to fetch post dates from Notion:", error);
      return { dates: {}, years: [] };
    }
  },
);

/**
 * Convenience wrapper to fetch all posts.
 */
export const fetchAllPosts = cache(async (): Promise<PageDataSchemaType[]> => {
  return fetchPosts({ limit: 100 }); // Reasonable upper bound for "all"
});

/**
 * Fetches a single post by its ID.
 */
export const fetchPostById = cache(
  async (postId: string): Promise<PageDataSchemaType | null> => {
    try {
      const page = (await officialClient.pages.retrieve({
        page_id: postId,
      })) as unknown as PageWithTimestamps & { properties?: PageProperty };

      if (!page) return null;

      if (page.properties?.Status?.status?.name !== "Done") {
        return null;
      }

      const [post] = mapNotionResultsToPosts([page]);
      return post ?? null;
    } catch (error) {
      console.error(`Failed to fetch post by ID ${postId}:`, error);
      return null;
    }
  },
);

/**
 * Fetches the high-fidelity content of a post using the unofficial Notion SDK.
 */
export const fetchPostContent = cache(
  async (pageId: string): Promise<ExtendedRecordMap | null> => {
    if (!pageId) return null;

    try {
      return await unofficialClient.getPage(pageId);
    } catch (error) {
      console.error(`Failed to fetch content for page ${pageId}:`, error);
      return null;
    }
  },
);

/**
 * Fetches content for specific fixed pages (About, Notes, Projects).
 */
export const fetchStaticPageContent = cache(
  async (
    type: "about" | "note" | "project",
  ): Promise<ExtendedRecordMap | null> => {
    const envMap = {
      about: "NOTION_ABOUT_PAGE_ID",
      note: "NOTION_NOTE_PAGE_ID",
      project: "NOTION_PROJECT_PAGE_ID",
    };

    const pageId = process.env[envMap[type]] as string;
    return fetchPostContent(pageId);
  },
);
