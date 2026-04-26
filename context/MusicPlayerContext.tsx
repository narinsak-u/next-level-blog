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
import { useHotkeys } from "@mantine/hooks";

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
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);

  useEffect(() => {
    setVolumeState(defaultVolume);
  }, [defaultVolume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume;

    const handleEnded = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlayingRef.current) {
      el.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      el.play().then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, []);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play().then(() => {
      isPlayingRef.current = true;
      setIsPlaying(true);
    }).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = vol;
    setVolumeState(vol);
  }, []);

  useHotkeys([["ctrl+M", togglePlay]]);

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