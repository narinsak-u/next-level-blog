// Notion content styles — scoped to pages that render Notion content
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import Layout from "@/components/layout/Layout";
import ContentTitle from "@/components/contents/ContentTitle";
import SpotlightClient from "@/components/common/SpotlightClient";

import { fetchPostById, fetchAllPosts } from "@/actions/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import useFetchAllPosts from "@/hooks/use-fetch-all-posts";
import ContentBody from "@/components/contents/ContentBody";
import Loader from "@/components/common/Loader";
import PageLayout from "@/components/layout/PageLayout";
import { siteMetadata } from "@/site/siteMetadata";
import Share from "@/components/contents/Share";
import { Box, Divider } from "@mantine/core";

type Params = Promise<{ slug: string }>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const layout = async ({ children, params }: Props) => {
  const { slug } = await params;

  const queryClient = new QueryClient();

  const [postData] = await Promise.all([
    fetchPostById(slug),
    queryClient.prefetchQuery({
      queryKey: useFetchAllPosts.getQueryKey(),
      queryFn: () => fetchAllPosts(),
    }),
  ]);

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
            <ContentTitle postData={postData} />
            <div className="sticky top-5 z-10 left-0">
              {postData ? (
                <Share
                  postLink={`${siteMetadata.siteAddress}/posts/${postData.id}`}
                />
              ) : null}
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ContentBody postData={postData}>
                <div>{children}</div>
              </ContentBody>
            </HydrationBoundary>
          </div>
        </PageLayout>
      </Layout>
    </>
  );
};

export default layout;
