"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import useVideoWithPlaceholder from "@/hooks/use-video-with-placeholder";

type Props = {
  src: string;
  className?: string;
  placeholder?: string;
};

const VideoWithPlaceholder = ({ src, className, placeholder }: Props) => {
  const { videoRef, videoLoaded } = useVideoWithPlaceholder({ src, placeholder });

  return (
    <>
      {placeholder ? (
        <Image
          src={placeholder}
          loading="eager"
          priority
          sizes="100vw"
          alt="Background"
          className={cn(className, { invisible: videoLoaded })}
          quality={100}
          fill
        />
      ) : null}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        controls={false}
        preload="auto"
        className={cn(className, { invisible: !videoLoaded })}
      />
    </>
  );
};

export default VideoWithPlaceholder;