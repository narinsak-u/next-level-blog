"use client";

import { Background } from "./Background";
import MainProfile from "./MainProfile";
import MainFooter from "./MainFooter";
import Credit from "./Credit";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

const NewProfile = () => {
  return (
    <MusicPlayerProvider src="/assets/where-winds-meet-ost.mp3">
      <main className="h-dvh w-full">
        <div className="relative h-full w-full">
          <Credit />
          <Background
            src="/assets/where-winds-meet-vdo.mp4"
            placeholder="/assets/where-winds-meet-wallpapers.jpg"
          />
          <MainProfile />
          <MainFooter />
        </div>
      </main>
    </MusicPlayerProvider>
  );
};

export default NewProfile;
