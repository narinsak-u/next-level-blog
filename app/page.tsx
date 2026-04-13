"use client";

import HomePage from "@/components/home/HomePage";
import NewProfile from "@/components/home/NewProfile";
import ModeSelector from "@/components/home/ModeSelector";
import { useModeStore } from "@/hooks/use-mode-store";

const Home = () => {
  const mode = useModeStore((state) => state.mode);

  return (
    <>
      <ModeSelector />
      {mode === "focused" ? <HomePage /> : <NewProfile />}
    </>
  );
};

export default Home;
