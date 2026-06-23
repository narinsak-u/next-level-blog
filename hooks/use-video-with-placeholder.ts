import { useEffect, useRef, useState } from "react";

interface UseVideoWithPlaceholderOptions {
  src: string;
  placeholder?: string;
}

const useVideoWithPlaceholder = ({
  src,
}: UseVideoWithPlaceholderOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoReady(true);
      video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      handleCanPlay();
      return;
    }

    video.addEventListener("canplay", handleCanPlay, { once: true });
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [src]);

  return { videoRef, videoReady };
};

export default useVideoWithPlaceholder;
