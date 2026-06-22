"use client";

import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useVideoWithPlaceholder from "@/hooks/use-video-with-placeholder";

interface MediaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const MediaBackground = ({ children, className }: MediaBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute bg-background left-0 top-0 w-full h-full object-cover",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface VideoBackgroundProps {
  src: string;
  placeholder?: string;
  className?: string;
}

const VideoBackground = ({
  src,
  placeholder,
  className,
}: VideoBackgroundProps) => {
  const { videoRef } = useVideoWithPlaceholder({ src, placeholder });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [src]);

  useEffect(() => {
    videoRef.current?.setAttribute("fetchpriority", "high");
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={placeholder}
      muted
      playsInline
      loop
      autoPlay
      controls={false}
      preload="auto"
      className={cn("absolute inset-0 w-full h-full object-cover", className)}
    />
  );
};

interface ImageBackgroundProps {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

const ImageBackground = ({
  src,
  alt = "Background",
  className,
  priority = true,
}: ImageBackgroundProps) => {
  return (
    <Image
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      src={src}
      alt={alt}
      className={cn("absolute inset-0 w-full h-full object-cover", className)}
      sizes="100vw"
      fill
    />
  );
};

MediaBackground.Video = VideoBackground;
MediaBackground.Image = ImageBackground;
MediaBackground.displayName = "MediaBackground";
VideoBackground.displayName = "VideoBackground";
ImageBackground.displayName = "ImageBackground";

export { MediaBackground, VideoBackground, ImageBackground };
export type {
  MediaBackgroundProps,
  VideoBackgroundProps,
  ImageBackgroundProps,
};
