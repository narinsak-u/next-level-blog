// Notion content styles — scoped to pages that render Notion content
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import Layout from "@/components/layout/Layout";
import ContentTitle from "@/components/contents/ContentTitle";
import ScrollToTop from "@/components/common/ScrollToTop";

import { cache } from "react";
import { fetchAllPosts, fetchPostById as _fetchPostById } from "@/actions/posts";

// React.cache() deduplicates fetchPostById across generateMetadata, page, and layout
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
  const [posts, postData] = await Promise.all([
    fetchAllPosts(),
    fetchPostById(slug),
  ]);

  if (!postData) return <Loader />;

  return (
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
          <ContentBody posts={posts} postData={postData}>
            <div>{children}</div>
          </ContentBody>

          <ScrollToTop />
        </div>
      </PageLayout>
    </Layout>
  );
};

export default layout;
