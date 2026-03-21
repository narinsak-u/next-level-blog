export const revalidate = 300;

// Notion content styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import AboutPage from "@/app/about/components/AboutPage";
import Content from "@/components/contents/Content";
import { fetchStaticPageContent } from "@/actions/posts";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — About me`,
  description: `About me. ✌️`,
  // openGraph: {
  //   images: [ogNoteImage],
  // },
};

const About = async () => {
  const recordMap = await fetchStaticPageContent("about");

  return (
    <AboutPage>{recordMap && <Content recordMap={recordMap} />}</AboutPage>
  );
};

export default About;
