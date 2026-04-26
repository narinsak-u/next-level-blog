"use client";

import { ShareGroup } from "@/components/ui/ShareButton";

type Props = {
  postLink: string;
};

const Share = ({ postLink }: Props) => {
  return <ShareGroup postLink={postLink} />;
};

export default Share;
