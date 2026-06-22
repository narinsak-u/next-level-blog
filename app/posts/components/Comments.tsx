"use client";

import Giscus from "@giscus/react";
import { useMantineColorScheme } from "@mantine/core";

const Comments = () => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Giscus
      id="comments"
      repo={`${process.env.NEXT_PUBLIC_GITHUB_NAME!}/${process.env
        .NEXT_PUBLIC_REPO!}`}
      repoId={process.env.NEXT_PUBLIC_REPO_ID!}
      category="Announcements"
      categoryId={process.env.NEXT_PUBLIC_CATEGORY_ID!}
      mapping="pathname"
      term="Welcome to @giscus/react component!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={colorScheme === "dark" ? "transparent_dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
};

export default Comments;
