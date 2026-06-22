import { useEffect, useRef, useState } from "react";

interface UseVideoWithPlaceholderOptions {
  src: string;
  placeholder?: string;
}

const useVideoWithPlaceholder = ({
  src,
  placeholder,
}: UseVideoWithPlaceholderOptions) => {
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

    const handleVideoReady = () => {
      setVideoLoaded(true);
      video.play();
    };

    video.addEventListener("loadeddata", handleVideoReady);
    video.addEventListener("canplay", handleVideoReady);
    video.load();

    if (video.readyState >= 2) {
      setVideoLoaded(true);
      video.play();
    }

    return () => {
      video.removeEventListener("loadeddata", handleVideoReady);
      video.removeEventListener("canplay", handleVideoReady);
    };
  }, [src]);

  return { videoRef, videoLoaded };
};

export default useVideoWithPlaceholder;