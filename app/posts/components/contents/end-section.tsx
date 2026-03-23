"use client";

import { format, parseISO } from "date-fns";
import { Text } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { PageDataSchemaType } from "@/types";

type Props = {
  posts: PageDataSchemaType[];
};

const EndSection = ({ posts }: Props) => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <div>
      <Text c="dimmed" size="sm">
        That&apos;s all posts for you, {""}
        <Text
          // variant="gradient"
          component="span"
          inherit
          onClick={() => {
            if (scroll.y > 0) scrollTo({ y: 0 });
          }}
          className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors duration-200"
        >
          Back to top ({`#${posts.length}`})
        </Text>
      </Text>
      <Text size="xs" mt={4}>
        Last updated on{" "}
        {`${format(
          parseISO(posts[0]?.lastUpdated ?? "2023-07-27T17:12:00.000Z"),
          "LLLL d, yyyy"
        )}`}
      </Text>
    </div>
  );
};

export default EndSection;
