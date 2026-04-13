"use client";

import { Container, Divider, Space, Stack, Box, Image } from "@mantine/core";
import { Navigations } from "@/site/data";
import ShortcutList from "@/components/ui/ShortcutList";
import FeedbackComponent from "./Feedback";

const HomePage: React.FC = () => {
  return (
    <Container>
      <div className="w-full min-h-screen flex items-center">
        <Stack style={{ margin: "0 auto", paddingLeft: "10px", gap: "4px" }}>
          <Box className="mx-auto flex gap-4 items-center">
            {/* image */}
            <Image
              src="/profile.jpg"
              alt="profile-image"
              w={180}
              h={180}
              // className="rounded-full!"
            />
            {/* text */}
            <div className="text-xs gap-2 leading-relaxed">
              <p className="mb-0!">
                Hi there! 👋
                <br /> I&apos;m Hai — 海
                <br /> ---
                <br /> AKA: alohadancemeow
                <br /> NAME: Zhang Hongli
                <br /> CN: 张泓历
                <br /> SERVER: TH
                <br /> GEN: Z ✌️
              </p>
            </div>
          </Box>
          <Space h="xs" />
          <Divider
            my="sm"
            variant="solid"
            labelPosition="center"
            label={
              <Box ml={5} mr={10}>
                <p className="mb-0!">Personal Home</p>
              </Box>
            }
          />

          <ShortcutList
            items={Navigations.map((nav) => ({
              id: nav.id,
              keys: [nav.emoji],
              label: nav.name,
              href: nav.href,
            }))}
          />

          <FeedbackComponent />
        </Stack>
      </div>
    </Container>
  );
};

export default HomePage;
