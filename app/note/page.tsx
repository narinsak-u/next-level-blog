export const revalidate = 300;

// Notion content styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import { Suspense } from "react";
import Content from "@/components/contents/Content";
import Loader from "@/components/common/Loader";
import { fetchPosts, fetchStaticPageContent } from "@/actions/posts";
import NotePage from "./components/NotePage";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Notes`,
  description: `I put all my notes, shortcuts, and quotes in here. ✌️`,
  // openGraph: {
  //   images: [ogNoteImage],
  // },
};

const Note = async () => {
  const recordMap = await fetchStaticPageContent("note");
  const posts = await fetchPosts({ limit: 100, status: "Done" });

  // Aggregate post counts by date (YYYY-MM-DD)
  const postDates = posts.reduce((acc, post) => {
    const date = post.createdTime.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <NotePage postDates={postDates}>
      <Suspense fallback={<Loader />}>
        {recordMap ? <Content recordMap={recordMap} /> : null}
      </Suspense>
    </NotePage>
  );
};

export default Note;
