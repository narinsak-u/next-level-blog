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

  return { videoRef, videoLoaded };
};

export default useVideoWithPlaceholder;