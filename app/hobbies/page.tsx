export const revalidate = 300;

// Notion content styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import ProjectPage from "./components/ProjectPage";
import Content from "@/components/contents/Content";
import { getProjectPageContent } from "@/actions/notion-x";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Hobbies`,
  description: `All projects. ✌️`,
  // openGraph: {
  //   images: [ogNoteImage],
  // },
};

const Projects = async () => {
  const recordMap = await getProjectPageContent();

  return (
    <ProjectPage>{recordMap && <Content recordMap={recordMap} />}</ProjectPage>
  );
};

export default Projects;
