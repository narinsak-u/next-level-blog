"use client";

import Content from "@/app/posts/components/Content";
import PostSummaryClient from "./PostSummaryClient";
import type { ExtendedRecordMap } from "notion-types";

interface PostPageClientProps {
  recordMap: ExtendedRecordMap | null;
  slug: string;
}

export default function PostPageClient({
  recordMap,
  slug,
}: PostPageClientProps) {
  return recordMap ? (
    <>
      <Content recordMap={recordMap} />
      <PostSummaryClient recordMap={recordMap} slug={slug} />
    </>
  ) : (
    <p role="status">Article content is temporarily unavailable.</p>
  );
}
