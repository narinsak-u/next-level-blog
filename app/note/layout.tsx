import Layout from "@/app/_layout/components/Layout";
import PageLayout from "@/app/_layout/components/PageLayout";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Box, Divider, Space } from "@mantine/core";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <PageLayout>
        {/* <Menu title="Liberation Notes" /> */}
        <Divider
          my="sm"
          variant="solid"
          labelPosition="center"
          label={
            <Box ml={5} mr={10}>
              <p className="mb-0!">Liberation Notes</p>
            </Box>
          }
        />
        <Space h="xs" />
        {children}
        <ScrollToTop />
      </PageLayout>
    </Layout>
  );
};

export default layout;
