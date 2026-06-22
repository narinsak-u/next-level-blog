import Layout from "@/app/_layout/components/Layout";
import Menu from "@/app/_layout/components/Menu";
import PageLayout from "@/app/_layout/components/PageLayout";
import SpotlightClient from "@/components/common/SpotlightClient";
import BackToPosts from "@/app/tags/components/BackToPosts";
import { Box, Divider, Space } from "@mantine/core";

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
          {/* <Menu title={`# ${slug}`} /> */}
          <Divider
            my="sm"
            variant="solid"
            labelPosition="center"
            label={
              <Box ml={5} mr={10}>
                <p className="mb-0!">{`# ${slug}`}</p>
              </Box>
            }
          />
          <Space h="xs" />
          {children}
          <BackToPosts />
        </PageLayout>
      </Layout>
    </>
  );
};

export default layout;
