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

/**
 * MusicPlayerContext - Global audio playback state management
 *
 * Provides a unified API for controlling background music across the app:
 * - Play/pause toggle with HTMLAudioElement ref
 * - Volume control with immediate DOM update
 * - Sync state between audio element and React state
 *
 * @example
 * ```tsx
 * // In root layout
 * <MusicPlayerProvider src="/song.mp3" defaultVolume={0.3}>
 *   {children}
 * </MusicPlayerProvider>
 *
 * // Anywhere in the app
 * const { togglePlay, volume, setVolume } = useMusicPlayer();
 * ```
 */
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

/**
 * Provider component for music playback
 * Creates an invisible audio element and manages its state
 */
interface MusicPlayerProviderProps {
  children: ReactNode;
  /** URL path to audio file (default: /assets/lan-ting-xu.mp3) */
  src?: string;
  /** Initial volume 0-1 (default: 0.3) */
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
    setVolumeState(defaultVolume);
  }, [defaultVolume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume;

    const handleEnded = () => setIsPlaying(false);
    el.addEventListener("ended", handleEnded);

    return () => {
      el.removeEventListener("ended", handleEnded);
    };
  }, []);

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
