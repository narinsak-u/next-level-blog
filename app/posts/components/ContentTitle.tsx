"use client";

import { format, parseISO } from "date-fns";
import { Box, Center, Divider, Space } from "@mantine/core";
import Header from "@/app/_layout/components/Header";
import TagItem from "@/app/posts/components/TagItem";
import { PageDataSchemaType } from "@/types";
import { notFound } from "next/navigation";

type Props = {
  postData: PageDataSchemaType;
};

const ContentTitle = ({ postData }: Props) => {
  if (!postData) return notFound();

  return (
    <Center className="flex flex-col gap-3">
      {/* <Header title={postData.title} /> */}
      {/* <time
        dateTime={postData.lastUpdated ?? postData.createdTime}
        className="text-xs uppercase tracking-widest text-foreground/40"
      >
        {format(
          parseISO(postData.lastUpdated ?? postData.createdTime),
          "yyyy-MM-dd"
        )}
      </time> */}
      {/* <TagItem tags={postData.tags} /> */}
      <Space h="xs" />
    </Center>
  );
};

export default ContentTitle;
