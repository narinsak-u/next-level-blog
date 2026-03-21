export const revalidate = 300;

// Notion content styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import Content from "@/components/contents/Content";
import { fetchStaticPageContent } from "@/actions/posts";
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

  return <NotePage>{recordMap && <Content recordMap={recordMap} />}</NotePage>;
};

export default Note;
