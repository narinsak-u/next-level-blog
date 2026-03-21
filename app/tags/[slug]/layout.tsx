import Layout from "@/components/layout/Layout";
import Menu from "@/components/layout/Menu";
import PageLayout from "@/components/layout/PageLayout";
import Spotlight from "@/components/common/Spotlight";
import BackToPosts from "@/app/tags/components/BackToPosts";
import { fetchAllPosts } from "@/actions/posts";

type Params = Promise<{ slug: string }>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const layout = async ({ children, params }: Props) => {
  const posts = await fetchAllPosts();
  const { slug } = await params;

  return (
    <>
      <Spotlight data={posts} />
      <Layout>
        <PageLayout>
          <Menu title={`# ${slug}`} />
          <BackToPosts />
          {children}
        </PageLayout>
      </Layout>
    </>
  );
};

export default layout;
