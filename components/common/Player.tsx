"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Space, Box } from "@mantine/core";

import { myMusic } from "@/site/data";

type Props = {
  opened: boolean;
};

export const Player: React.FC<Props> = ({ opened }) => {
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
            src={myMusic.src}
            showSkipControls={false}
            showJumpControls={false}
            header={`🎵 Now Playing : 도나 (DONNA) - ${myMusic.name}`}
          />

          <Space h={"xl"} />
        </Box>
      ) : null}
    </>
  );
};

export default Player;
