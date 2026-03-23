import ScrollToTop from "@/components/common/ScrollToTop";
import Layout from "@/components/layout/Layout";
import Menu from "@/components/layout/Menu";
import PageLayout from "@/components/layout/PageLayout";
import { Box, Divider, Space } from "@mantine/core";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <PageLayout>
        {/* <Menu title="Hobbies" /> */}
        <Divider
          my="sm"
          variant="solid"
          labelPosition="center"
          label={
            <Box ml={5} mr={10}>
              <p className="mb-0!">Hobbies</p>
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
