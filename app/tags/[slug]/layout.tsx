import Layout from "@/components/layout/Layout";
import Menu from "@/components/layout/Menu";
import PageLayout from "@/components/layout/PageLayout";
import SpotlightClient from "@/components/common/SpotlightClient";
import BackToPosts from "@/app/tags/components/BackToPosts";

type Params = Promise<{ slug: string }>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const layout = async ({ children, params }: Props) => {
  const { slug } = await params;

  return (
    <>
      <SpotlightClient />
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
