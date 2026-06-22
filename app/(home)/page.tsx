"use client";

import { MusicPlayerProvider } from "@/app/(home)/context/MusicPlayerContext";
import HomeContent from "@/app/(home)/components/HomeContent";

const Home = () => {
  return (
    <MusicPlayerProvider>
      <HomeContent />
    </MusicPlayerProvider>
  );
};

export default Home;