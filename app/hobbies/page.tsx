export const revalidate = 300;

// Notion content styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import { Suspense } from "react";
import ProjectPage from "./components/ProjectPage";
import Content from "@/components/contents/Content";
import Loader from "@/components/common/Loader";
import { fetchStaticPageContent } from "@/actions/posts";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Hobbies`,
  description: `All projects. ✌️`,
  // openGraph: {
  //   images: [ogNoteImage],
  // },
};

const Projects = async () => {
  const recordMap = await fetchStaticPageContent("project");

  return (
    <ProjectPage>
      <Suspense fallback={<Loader />}>
        {recordMap ? <Content recordMap={recordMap} /> : null}
      </Suspense>
    </ProjectPage>
  );
};

export default Projects;
