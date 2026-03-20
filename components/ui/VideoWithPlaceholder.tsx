"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  className?: string;
  placeholder?: string;
};

const VideoWithPlaceholder = ({ src, className, placeholder }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !placeholder) {
      console.warn("No placeholder provided for video");
    }
  }, [placeholder]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoReady = () => setVideoLoaded(true);

    video.addEventListener("loadeddata", handleVideoReady);
    video.addEventListener("canplay", handleVideoReady);
    video.load();

    if (video.readyState >= 2) {
      setVideoLoaded(true);
    }

    return () => {
      video.removeEventListener("loadeddata", handleVideoReady);
      video.removeEventListener("canplay", handleVideoReady);
    };
  }, [src]);

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play();
    }
  }, [videoLoaded]);

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
