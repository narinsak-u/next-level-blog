"use client";

import { useEffect } from "react";
import { useHotkeys } from "@mantine/hooks";
import HomePage from "@/components/home/HomePage";
import NewProfile from "@/components/home/NewProfile";
import { useModeStore } from "@/hooks/use-mode-store";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

const HomeContent = () => {
  const mode = useModeStore((state) => state.mode);
  const setMode = useModeStore((state) => state.setMode);
  const { play, pause } = useMusicPlayer();

  useEffect(() => {
    useModeStore.persist.rehydrate();
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

const Home = () => {
  return (
    <MusicPlayerProvider src="/assets/where-winds-meet-ost.mp3">
      <HomeContent />
    </MusicPlayerProvider>
  );
};

export default Home;
