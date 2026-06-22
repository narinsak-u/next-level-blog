"use client";

import { MusicPlayerProvider } from "@/app/(home)/context/MusicPlayerContext";
import HomeContent from "@/app/(home)/components/HomeContent";

const Home = () => {
  return (
    <MusicPlayerProvider src="/assets/where-winds-meet-ost.mp3">
      <HomeContent />
    </MusicPlayerProvider>
  );
};

export default Home;