// Notion content styles — scoped to pages that render Notion content
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import Layout from "@/components/layout/Layout";
import ContentTitle from "@/components/contents/ContentTitle";
import ScrollToTop from "@/components/common/ScrollToTop";
import SpotlightClient from "@/components/common/SpotlightClient";

import { cache } from "react";
import { fetchPostById as _fetchPostById } from "@/actions/posts";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import useFetchAllPosts from "@/hooks/use-fetch-all-posts";
import { fetchAllPosts } from "@/actions/posts";

const fetchPostById = cache(_fetchPostById);
import ContentBody from "@/components/contents/ContentBody";
import Loader from "@/components/common/Loader";
import PageLayout from "@/components/layout/PageLayout";
import { siteMetadata } from "@/site/siteMetadata";
import Share from "@/components/contents/Share";

type Params = Promise<{ slug: string }>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const layout = async ({ children, params }: Props) => {
  const { slug } = await params;
  const postData = await fetchPostById(slug);

  if (!postData) return <Loader />;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: useFetchAllPosts.getQueryKey(),
    queryFn: async () => {
      const posts = await fetchAllPosts();
      return posts;
    },
  });

  return (
    <>
      <SpotlightClient />
      <Layout>
        <PageLayout>
          <div className="relative h-full p-0 mt-3">
            <ContentTitle postData={postData} />
            <div className="sticky top-5 z-10 left-0">
              {postData && (
                <Share
                  postLink={`${siteMetadata.siteAddress}/posts/${postData.id}`}
                />
              )}
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ContentBody postData={postData}>
                <div>{children}</div>
              </ContentBody>
            </HydrationBoundary>

            <ScrollToTop />
          </div>
        </PageLayout>
      </Layout>
    </>
  );
};

export default layout;
