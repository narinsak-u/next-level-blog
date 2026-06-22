"use client";

import { Center, Space } from "@mantine/core";
import { PageDataSchemaType } from "@/types";
import { notFound } from "next/navigation";

type Props = {
  postData: PageDataSchemaType;
};

const ContentTitle = ({ postData }: Props) => {
  if (!postData) return notFound();

  return (
    <Center>
      <Space h="xs" />
    </Center>
  );
};

export default ContentTitle;
