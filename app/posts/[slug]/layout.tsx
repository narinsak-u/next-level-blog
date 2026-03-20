import Layout from "@/components/layout/Layout";
import ContentTitle from "@/components/contents/ContentTitle";
import ScrollToTop from "@/components/common/ScrollToTop";

import { getAllPosts } from "@/actions/notion";
import { getPostById } from "@/actions/get-post-by-id";
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
    getAllPosts(),
    getPostById(slug),
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
