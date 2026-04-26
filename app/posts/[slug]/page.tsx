import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { fetchPostById, fetchPostContent } from "@/actions/posts";
import { PostTagSchemaType } from "@/types";

import { siteMetadata } from "@/site/siteMetadata";
import PostPageClient from "./components/PostPageClient";
import Loader from "@/components/common/Loader";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const postData = await fetchPostById(slug);
  if (!postData) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const tags = (postData.tags || []) as PostTagSchemaType[];

  return {
    title: `${siteMetadata.title} — ${postData.title}`,
    description: postData && postData.description,
    keywords: tags.map((tag) => String(tag.name)),
    openGraph: {
      images: postData.coverImage
        ? [postData.coverImage, ...previousImages]
        : previousImages,
    },
  };
}

const Post = async ({ params }: Props) => {
  const { slug } = await params;
  const recordMap = await fetchPostContent(slug);

  return (
    <Suspense fallback={<Loader />}>
      {recordMap && <PostPageClient recordMap={recordMap} />}
    </Suspense>
  );
};

export default Post;
