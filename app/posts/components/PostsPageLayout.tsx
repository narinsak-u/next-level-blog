"use client";

import { ActionIcon, Divider, Space, Timeline } from "@mantine/core";
import { Hash, LayoutGrid, LayoutList } from "tabler-icons-react";
import { useMemo } from "react";

import Menu from "@/components/layout/Menu";
import Layout from "@/components/layout/Layout";
import PageLayout from "@/components/layout/PageLayout";
import Spotlight from "@/components/common/Spotlight";
import SearchPost from "@/app/posts/components/SearchPost";
import TagSection from "./contents/tag-section";
import Loader from "@/components/common/Loader";

import { PageDataSchemaType } from "@/types";
import { getTags } from "@/helpers/get-all-tags";
import { getCategory } from "@/helpers/get-unique-category";
import useLayoutStore from "@/hooks/use-layout-store";

/**
 * PostsPageLayout - Main layout wrapper for the posts listing page
 *
 * Renders the posts page shell including:
 * - Spotlight search overlay (keyboard shortcut: Cmd+K)
 * - Tag/category timeline navigation
 * - Grid/List view toggle (persisted in layout store)
 *
 * @example
 * ```tsx
 * <PostsPageLayout posts={posts}>
 *   <PostsList />
 * </PostsPageLayout>
 * ```
 */
type Props = {
  /** React children rendered after the header/timeline section */
  children: React.ReactNode;
  /** Array of validated post data from Notion CMS */
  posts: PageDataSchemaType[];
};

const PostsPageLayout = ({ children, posts }: Props) => {
  const { isGrid, toggle } = useLayoutStore();

  const tags = useMemo(() => getTags(posts), [posts]);
  const categoryCount = useMemo(() => getCategory(posts).length, [posts]);

  if (!posts) return <Loader />;

  return (
    <>
      <Spotlight data={posts} />
      <Layout>
        <PageLayout>
          <Menu title="alohadancemeow posts" />
          <SearchPost />

          <Space h="md" />

          <Timeline
            bulletSize={24}
            lineWidth={2}
            style={{ padding: "0" }}
          >
            <Timeline.Item
              bullet={<Hash size={16} />}
              title="CHOOSE YOUR CONTENT"
            >
              <TagSection tags={tags} categoryCount={categoryCount} />
            </Timeline.Item>
          </Timeline>

          <Divider
            my="xs"
            labelPosition="right"
            label={
              <div className="flex gap-2 justify-center items-center">
                <div>Layout</div>

                <ActionIcon
                  component="div"
                  color="orange"
                  size="md"
                  radius="sm"
                  variant="filled"
                  className="!bg-orange-500 dark:!bg-amber-900"
                  onClick={() => toggle()}
                >
                  {isGrid ? (
                    <LayoutGrid
                      size={18}
                      className="text-black dark:text-white"
                    />
                  ) : (
                    <LayoutList
                      size={18}
                      className="text-black dark:text-white"
                    />
                  )}
                </ActionIcon>
              </div>
            }
          />
          <Space h="sm" />
          {children}
          <Space h="lg" />
        </PageLayout>
      </Layout>
    </>
  );
};

export default PostsPageLayout;
