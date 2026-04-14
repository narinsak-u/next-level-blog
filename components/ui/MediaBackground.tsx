"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import useVideoWithPlaceholder from "@/hooks/use-video-with-placeholder";

interface MediaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const MediaBackground = ({
  children,
  className,
}: MediaBackgroundProps) => {
  return (
    <div
      className={cn(
        "absolute bg-background left-0 top-0 w-full h-full object-cover",
        className
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
          className={cn("absolute inset-0 w-full h-full object-cover", className, {
            invisible: videoLoaded,
          })}
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
        className={cn("absolute inset-0 w-full h-full object-cover", className, {
          invisible: !videoLoaded,
        })}
      />
    </>
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
export type { MediaBackgroundProps, VideoBackgroundProps, ImageBackgroundProps };