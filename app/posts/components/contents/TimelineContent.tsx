"use client";

import { Timeline } from "@mantine/core";
import { Books, SignRight } from "tabler-icons-react";
import EndSection from "./end-section";
import PostGrid from "./post-grid";

import { PageDataSchemaType } from "@/types";
import { getCategory } from "@/app/posts/helpers/get-unique-category";

type Props = {
  posts: PageDataSchemaType[];
};

const CATEGORY_CONFIGS = [
  {
    key: "today-i-learned",
    description: "Sharing tidbits of wisdom I picked up today, maybe something you'll find useful too.",
  },
  {
    key: "i-read-a-lot",
    description: "Diving into the books I've devoured lately, sharing the highlights and insights.",
  },
  {
    key: "no-work-today",
    description: "Recommending random entertainment gems – movies, anime, manga, and all things fun for a day off.",
  },
] as const;

const TimelineContent = ({ posts }: Props) => {
  const categories = getCategory(posts);

  return (
    <>
      <Timeline bulletSize={24} lineWidth={2} style={{ padding: "0" }}>
        {CATEGORY_CONFIGS.map((config, index) => {
          const categoryName = categories[index];
          if (!categoryName) return null;

          return (
            <Timeline.Item
              key={config.key}
              bullet={<Books size={16} />}
              title={categoryName.toUpperCase()}
            >
              <PostGrid
                categoryName={categoryName}
                description={config.description}
              />
            </Timeline.Item>
          );
        })}

        <Timeline.Item
          title="END OF CONTENT"
          bullet={<SignRight size={16} />}
        >
          <EndSection posts={posts} />
        </Timeline.Item>
      </Timeline>
    </>
  );
};

export default TimelineContent;
