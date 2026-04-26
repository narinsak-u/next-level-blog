"use client";

import { ActionIcon, Box, Divider, Space } from "@mantine/core";
import { LayoutGrid, LayoutList } from "tabler-icons-react";
import { useMemo } from "react";

// import Menu from "@/components/layout/Menu";
import Layout from "@/components/layout/Layout";
import PageLayout from "@/components/layout/PageLayout";
import Spotlight from "@/components/common/Spotlight";
import TagSection from "./contents/tag-section";
import TimelineContent from "./contents/TimelineContent";
import Loader from "@/components/common/Loader";
import ScrollToTop from "@/components/common/ScrollToTop";

import { PageDataSchemaType } from "@/types";
import { getTags } from "@/helpers/get-all-tags";
import { getCategory } from "@/helpers/get-unique-category";
import useLayoutStore from "@/hooks/use-layout-store";

type Props = {
  posts: PageDataSchemaType[];
};

const PostsPageLayout = ({ posts }: Props) => {
  const { isGrid, toggle } = useLayoutStore();

  const tags = useMemo(() => getTags(posts), [posts]);
  const categoryCount = getCategory(posts).length;

  if (!posts) return <Loader />;

  return (
    <>
      <Spotlight data={posts} />
      <Layout>
        <PageLayout>
          {/* <Menu title="alohadancemeow posts" /> */}

          <Divider
            my="sm"
            variant="solid"
            labelPosition="center"
            label={
              <Box ml={5} mr={10}>
                <p className="mb-0!">Posts</p>
              </Box>
            }
          />
          <Space h="xs" />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-foreground/50">
              Choose your content
            </p>
            <TagSection tags={tags} categoryCount={categoryCount} />
          </div>

          <Divider
            my="xs"
            labelPosition="right"
            label={
              <>
                <span className="text-xs uppercase tracking-widest text-foreground/50">
                  Layout
                </span>
                <ActionIcon
                  component="div"
                  size="md"
                  radius={0}
                  variant="subtle"
                  className="bg-white/5 hover:bg-orange-500/15 border border-white/10 hover:border-orange-500/30 transition-all duration-200"
                  onClick={() => toggle()}
                  aria-label={isGrid ? "Switch to list layout" : "Switch to grid layout"}
                >
                  {isGrid ? (
                    <LayoutGrid size={16} className="text-orange-500" />
                  ) : (
                    <LayoutList size={16} className="text-orange-500" />
                  )}
                </ActionIcon>
              </>
            }
          />
          <TimelineContent posts={posts} />
          <Space h="lg" />
          
           <ScrollToTop />
        </PageLayout>
      </Layout>
    </>
  );
};

export default PostsPageLayout;
