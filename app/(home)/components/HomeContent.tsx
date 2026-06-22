"use client";

import { useEffect } from "react";
import { useHotkeys } from "@mantine/hooks";
import HomePage from "@/app/(home)/components/HomePage";
import NewProfile from "@/app/(home)/components/NewProfile";
import { useModeStore } from "@/app/(home)/hooks/use-mode-store";
import { useMusicPlayer } from "@/app/(home)/context/MusicPlayerContext";

const HomeContent = () => {
  const mode = useModeStore((state) => state.mode);
  const setMode = useModeStore((state) => state.setMode);
  const { play, pause } = useMusicPlayer();

  useEffect(() => {
    useModeStore.persist.rehydrate();
    setMode("focused");
  }, []);

  useEffect(() => {
    if (mode === "jianghu") {
      play();
    } else {
      pause();
    }
  }, [mode, play, pause]);

  useHotkeys([
    ["ctrl+Q", () => setMode(mode === "focused" ? "jianghu" : "focused")],
  ]);

  return <>{mode === "focused" ? <HomePage /> : <NewProfile />}</>;
};

export default HomeContent;
