"use client";

// https://github.com/lhz516/react-h5-audio-player#readme
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Space, Box } from "@mantine/core";

import { myMusic } from "@/site/data";

type Props = {
  opened: boolean;
};

export const Player: React.FC<Props> = ({ opened }) => {
  const musicTracks = [
    {
      name: myMusic.name,
      src: myMusic.src,
    },
  ];

  const [trackIndex, setTrackIndex] = useState(0);

  const handleClickPrevious = () => {
    setTrackIndex((currentTrack) =>
      currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1
    );
  };

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < musicTracks.length - 1 ? currentTrack + 1 : 0
    );
  };

  return (
    <>
      {opened ? (
        <Box>
          <AudioPlayer
            style={{
              borderRadius: "5px",
              backgroundColor: "transparent",
              margin: "0 auto",
              width: "60%",
            }}
            autoPlay
            loop
            // layout="horizontal"
            src={musicTracks[trackIndex].src}
            // onPlay={(e) => console.log("onPlay")}
            showSkipControls={true}
            showJumpControls={false}
            header={`🎵 Now Playing : 도나 (DONNA) - ${musicTracks[trackIndex].name}`}
            // footer="All music from: www.bensound.com"
            onClickPrevious={handleClickPrevious}
            onClickNext={handleClickNext}
            onEnded={handleClickNext}
            // other props here
            // customAdditionalControls={[]}
          />

          <Space h={"xl"} />
        </Box>
      ) : null}
    </>
  );
};

export default Player;
