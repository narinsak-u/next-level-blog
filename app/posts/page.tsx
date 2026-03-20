export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getAllPosts } from "@/actions/notion";

import { siteMetadata } from "@/site/siteMetadata";
// import { ogPoststImage } from "@/site/data";

import PostsPageLayout from "@/app/posts/components/PostsPageLayout";
import TimelineContent from "@/app/posts/components/contents/TimelineContent";
import { Suspense } from "react";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Posts`,
  description: `All posts from ${siteMetadata.title}`,
  // openGraph: {
  //   images: [ogPoststImage],
  // },
};

const Posts = async () => {
  const posts = await getAllPosts();

  // console.log(posts, "posts");

  return (
    <PostsPageLayout posts={posts}>
      <Suspense fallback={<Loader />}>
        <TimelineContent posts={posts} />
      </Suspense>
    </PostsPageLayout>
  );
};

export default Posts;
