// Notion content styles — scoped to pages that render Notion content
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import Layout from "@/app/_layout/components/Layout";
import SpotlightClient from "@/components/common/SpotlightClient";

import { fetchPostById } from "@/app/posts/actions/posts";
import ContentBody from "@/app/posts/components/ContentBody";
import RelatedPostsServer from "@/app/posts/components/RelatedPostsServer";
import Loader from "@/components/common/Loader";
import PageLayout from "@/app/_layout/components/PageLayout";
import { siteMetadata } from "@/site/siteMetadata";
import { ShareGroup } from "@/app/posts/components/ShareButton";
import { Box, Divider } from "@mantine/core";

type Params = Promise<{ slug: string }>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const layout = async ({ children, params }: Props) => {
  const { slug } = await params;

  const postData = await fetchPostById(slug);

  if (!postData) return <Loader />;

  return (
    <>
      <SpotlightClient />
      <Layout>
        <PageLayout>
          <div className="relative h-full p-0 mt-3">
            <Divider
              my="sm"
              variant="solid"
              labelPosition="center"
              label={
                <Box ml={5} mr={10}>
                  <p className="mb-0!">{`${postData.title}`}</p>
                </Box>
              }
            />
            <div className="sticky top-5 z-10 left-0">
              {postData ? (
                <ShareGroup
                  postLink={`${siteMetadata.siteAddress}/posts/${postData.id}`}
                />
              ) : null}
            </div>
            <ContentBody
              postData={postData}
              relatedPosts={<RelatedPostsServer postData={postData} />}
            >
              <div>{children}</div>
            </ContentBody>
          </div>
        </PageLayout>
      </Layout>
    </>
  );
};

export default layout;
