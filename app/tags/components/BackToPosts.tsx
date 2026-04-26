"use client";

import { Box, Divider, Space, Text, UnstyledButton } from "@mantine/core";
import { ArrowBigLeftLine } from "tabler-icons-react";
import { useRouter } from "next/navigation";

const BackToPosts = () => {
  const router = useRouter();

  return (
    <>
    <Space h={"xs"} />
      <Divider
        my="xs"
        variant="solid"
        labelPosition="center"
        label={
          <button
            className="flex items-center cursor-pointer bg-transparent border-0 p-0"
            onClick={() => router.push("/posts")}
          >
            <ArrowBigLeftLine size={15} />
            <Box ml={5} mr={10}>
              <p className="mb-0!">Back to Posts</p>
            </Box>
          </button>
        }
      />
      <Space h={"xs"} />
    </>
  );
};

export default BackToPosts;
