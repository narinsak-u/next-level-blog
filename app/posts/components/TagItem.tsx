"use client";

import Link from "next/link";
import { Box } from "@mantine/core";
import { PostTagSchemaType } from "@/types";

type Props = {
  tags: PostTagSchemaType[];
};

const TagItem = ({ tags }: Props) => {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        alignItems: "center",
        marginTop: "5px",
        fontSize: "12px",
      }}
    >
      {tags &&
        tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.name}`}
            style={{ textDecoration: "none", color: "grey", cursor: "pointer" }}
          >
            {`#${tag.name}`}
          </Link>
        ))}
    </Box>
  );
};

export default TagItem;
