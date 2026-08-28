"use client";

import Content from "@/app/posts/components/Content";
import PostSummaryClient from "./PostSummaryClient";
import type { ExtendedRecordMap } from "notion-types";

interface PostPageClientProps {
  recordMap: ExtendedRecordMap;
  slug: string;
}

export default function PostPageClient({
  recordMap,
  slug,
}: PostPageClientProps) {
  return (
    <>
      <Content recordMap={recordMap} />
      <PostSummaryClient recordMap={recordMap} slug={slug} />
    </>
  );
}
