export const dynamic = 'force-dynamic'

import { Metadata } from "next";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogNoteImage } from "@/site/data";

import AboutPage from "@/app/about/components/AboutPage";
import Content from "@/components/contents/Content";
import { getAboutPageContent } from "@/actions/notion-x";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — About me`,
  description: `About me. ✌️`,
  // openGraph: {
  //   images: [ogNoteImage],
  // },
};

const About = async () => {
  const recordMap = await getAboutPageContent();

  return (
    <AboutPage>{recordMap && <Content recordMap={recordMap} />}</AboutPage>
  );
};

export default About;
