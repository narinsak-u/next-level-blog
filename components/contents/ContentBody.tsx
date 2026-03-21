"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Space, Box, Divider } from "@mantine/core";
import { PageDataSchemaType } from "@/types";
import Loader from "../common/Loader";
import RelatedPostsWrapper from "./RelatedPostsWrapper";
import Comments from "./Comments";

type Props = {
  postData: PageDataSchemaType;
  children: React.ReactNode;
};

const ContentBody = ({ children, postData }: Props) => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="w-full m-auto max-w-3xl">
        <div className="mx-auto mb-8">{children}</div>

        <Space h={"xl"} />

        <Box className="flex justify-center items-center gap-2">
          <p> More in : </p>
          {postData.tags.map((tag, i) => (
            <Link key={i} href={`/tags/${tag.name}`}>
              <span className="decoration-none cursor-pointer">{`#${tag.name}`}</span>
            </Link>
          ))}
        </Box>

        <RelatedPostsWrapper postData={postData} />
        <Divider className="my-14" />
        <Comments />
      </div>
    </Suspense>
  );
};

export default ContentBody;
