"use client";

import { Background } from "./Background";
import MainProfile from "./MainProfile";
import MainFooter from "./MainFooter";
import Credit from "./Credit";

const NewProfile = () => {
  return (
    <main className="h-dvh w-full">
      <div className="relative h-full w-full">
        <Credit />
        <Background
          src="/assets/where-winds-meet-vdo.mp4"
          placeholder="/assets/where-winds-meet-wallpapers.jpg"
        />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
        <MainProfile />
        <MainFooter />
      </div>
    </main>
  );
};

export default NewProfile;
