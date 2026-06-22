"use client";

import dynamic from "next/dynamic";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import { notFound } from "next/navigation";
import { useCallback } from "react";
import useGetTweetId from "@/app/posts/hooks/use-get-tweet-id";
import ContentErrorBoundary from "./ContentErrorBoundary";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);

const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);

const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

const Tweet = dynamic(() => import("./TweetBox"));

type Props = {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
};

const Content = ({ recordMap }: Props) => {
  const { tweetId } = useGetTweetId({ recordMap });

  const myTweet = useCallback(() => {
    if (!tweetId) return null;
    return <Tweet id={tweetId} />;
  }, [tweetId]);

  if (!recordMap) return notFound();

  return (
    <ContentErrorBoundary>
      <NotionRenderer
        recordMap={recordMap}
        disableHeader
        components={{
          Code,
          Equation,
          Modal,
          Pdf,
          Tweet: myTweet,
        }}
        className="prose dark:prose-a:border-amber-700! prose-blockquote:border-amber-500! dark:prose-blockquote:border-amber-700!"
      />
    </ContentErrorBoundary>
  );
};

export default Content;
