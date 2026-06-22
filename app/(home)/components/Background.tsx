"use client";

import { MediaBackground } from "@/components/ui/MediaBackground";

export const Background = ({
  src,
  placeholder,
}: {
  src: string;
  placeholder?: string;
}) => {
  return (
    <MediaBackground>
      <MediaBackground.Video src={src} placeholder={placeholder} />
    </MediaBackground>
  );
};
