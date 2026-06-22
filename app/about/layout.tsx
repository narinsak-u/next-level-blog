import Layout from "@/app/_layout/components/Layout";
import PageLayout from "@/app/_layout/components/PageLayout";
import { Box, Divider } from "@mantine/core";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <PageLayout>
        <Divider
          my="sm"
          variant="solid"
          labelPosition="center"
          label={
            <Box ml={5} mr={10}>
              <p className="mb-0!">About Me</p>
            </Box>
          }
        />
        {children}
      </PageLayout>
    </Layout>
  );
};

export default layout;
