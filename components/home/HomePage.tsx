"use client";

import { Container, Divider, Space, Box, Image } from "@mantine/core";
import { Navigations, MainKeys } from "@/site/data";
import ShortcutList from "@/components/ui/ShortcutList";
import KeyShortcuts from "@/app/posts/components/KeyShortcuts";

const HomePage: React.FC = () => {
  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="mx-auto pl-2.5 gap-1 flex flex-col">
          <div className="self-start">
            <KeyShortcuts items={MainKeys} />
          </div>
          <Space h="lg" />
          <Box className="flex gap-4 items-center">
            <Image src="/profile.jpg" alt="profile-image" w={190} h={190} />
            <div className="text-xs gap-2 leading-relaxed">
              <p className="mb-0!">
                Hi there! 👋
                <br /> I&apos;m Hai — 海
                <br /> ---
                <br /> AKA: alohadancemeow
                <br /> NAME: Zhang Hongli
                <br /> CN: 张泓历
                <br /> SERVER: TH
                <br /> INTEREST: Coding, History
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
          <div className="self-start">
            <ShortcutList
              items={Navigations.map((nav) => ({
                id: nav.id,
                keys: [nav.emoji],
                label: nav.name,
                href: nav.href,
              }))}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
