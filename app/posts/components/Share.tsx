"use client";

import { ShareGroup } from "@/app/posts/components/ShareButton";

type Props = {
  postLink: string;
};

const Share = ({ postLink }: Props) => {
  return <ShareGroup postLink={postLink} />;
};

export default Share;
