"use client";

import { Play, Pause } from "lucide-react";
import { useMusicPlayer } from "@/app/(home)/context/MusicPlayerContext";
import { MUSIC } from "@/lib/constants";

const MusicPlayer = () => {
  const { audioRef, isPlaying, togglePlay } = useMusicPlayer();

  return (
    <div className="pointer-events-auto">
      <button
        type="button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        onClick={togglePlay}
        className="flex items-center cursor-pointer justify-center h-9 w-9 rounded-full bg-black/60 hover:bg-black/70 active:bg-black/80 text-white/80 transition"
      >
        {isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </button>
      <audio ref={audioRef} src={MUSIC.SRC} preload="none" loop />
    </div>
  );
};

export default MusicPlayer;
