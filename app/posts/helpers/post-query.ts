import type { PageDataSchemaType } from "@/types";
import type { QueryDataSourceParameters } from "@notionhq/client/build/src/api-endpoints";

export interface PostQueryOptions {
  category?: string;
  cursor?: string;
  pageSize?: number;
  status?: string;
}

export interface PostQueryPage {
  items: PageDataSchemaType[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type PostQueryResponse = {
  results: unknown[];
  next_cursor: string | null;
  has_more: boolean;
};

type PostResultMapper = (results: unknown[]) => PageDataSchemaType[];

export const buildPostFilter = (
  status = "Done",
  category?: string,
): QueryDataSourceParameters["filter"] => {
  const statusFilter: QueryDataSourceParameters["filter"] = {
    property: "Status",
    status: { equals: status },
  };

  if (!category) return statusFilter;

  return {
    and: [statusFilter, { property: "Category", select: { equals: category } }],
  };
};

export const mapPostQueryPage = (
  response: PostQueryResponse,
  mapResults: PostResultMapper = () => [],
): PostQueryPage => ({
  items: mapResults(response.results),
  nextCursor: response.next_cursor,
  hasMore: response.has_more,
});
