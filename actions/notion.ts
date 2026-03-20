"use server";

import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "@/lib/notion-client";
import { postMapping } from "@/helpers/post-mapping";

type NotionQueryParams = {
  filter: QueryDatabaseResponse["results"] extends Array<infer T> ? Record<string, unknown> : never;
  sorts: QueryDatabaseResponse["results"] extends Array<infer T> ? Array<Record<string, unknown>> : never;
};

const DEFAULT_POST_LIMIT = 6;

const queryNotionDataSources = async (queryParams: NotionQueryParams) => {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID as string,
      ...queryParams,
    });

    return response.results;
  } catch (error) {
    console.error("Failed to query Notion database:", error);
    throw new Error("Failed to query Notion database");
  }
};

export const getAllPosts = async () => {
  const queryParams: NotionQueryParams = {
    filter: {
      property: "Status",
      status: {
        equals: "Done",
      },
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  };

  const results = await queryNotionDataSources(queryParams);

  if (!results.length) return [];

  const pageData = postMapping(results);

  return pageData;
};

export const getPostsByCategory = async (
  categoryName: string,
  limit: number = DEFAULT_POST_LIMIT,
  page: number
) => {
  const queryParams: NotionQueryParams = {
    filter: {
      and: [
        {
          property: "Category",
          select: {
            equals: categoryName,
          },
        },
        {
          property: "Status",
          status: {
            equals: "Done",
          },
        },
      ],
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  };

  const results = await queryNotionDataSources(queryParams);
  if (!results.length) return [];

  const pageData = postMapping(results.slice((page - 1) * limit, page * limit));
  return pageData;
};

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};
