"use client";

import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import HomeContent from "@/app/home/HomeContent";

const Home = () => {
  return (
    <MusicPlayerProvider src="/assets/where-winds-meet-ost.mp3">
      <HomeContent />
    </MusicPlayerProvider>
  );
};

export default Home;