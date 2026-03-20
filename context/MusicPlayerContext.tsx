"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MusicPlayerContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

interface MusicPlayerProviderProps {
  children: ReactNode;
  src?: string;
  defaultVolume?: number;
}

const MusicPlayerProvider = ({
  children,
  src = "/assets/lan-ting-xu.mp3",
  defaultVolume = 0.3,
}: MusicPlayerProviderProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = defaultVolume;

    const handleEnded = () => setIsPlaying(false);
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("ended", handleEnded);
    };
  }, [defaultVolume]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = vol;
    setVolumeState(vol);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        play,
        pause,
        audioRef,
        volume,
        setVolume,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

const useMusicPlayer = (): MusicPlayerContextValue => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error(
      "useMusicPlayer must be used within a MusicPlayerProvider"
    );
  }
  return context;
};

export { MusicPlayerProvider, useMusicPlayer };
export type { MusicPlayerContextValue, MusicPlayerProviderProps };
