"use client";

import { Background } from "./Background";
import MainProfile from "./MainProfile";
import MainFooter from "./MainFooter";
import Credit from "./Credit";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

const NewProfile = () => {
  return (
    <MusicPlayerProvider>
      <main className="h-[100dvh] w-full">
        <div className="relative h-full w-full">
          <Credit />
          <Background
            src="/silhouette-at-twilight.mp4"
            placeholder="/alt-placeholder.jpg"
          />
          <MainProfile />
          <MainFooter />
        </div>
      </main>
    </MusicPlayerProvider>
  );
};

export default NewProfile;