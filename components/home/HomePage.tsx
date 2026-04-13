"use client";

import Link from "next/link";
import { Container, Divider, Space, Stack, Box, Image } from "@mantine/core";
import { cn } from "@/lib/utils";

import { Navigations } from "@/site/data";
import FeedbackComponent from "./Feedback";

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd
    className={cn(
      "inline-flex items-center px-1.5 py-0.5",
      "text-[10px] font-medium uppercase tracking-wide",
      "bg-white/5 border border-white/15 text-foreground/50",
    )}
  >
    {children}
  </kbd>
);

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

          <div className="flex items-center justify-center gap-4 py-2">
            {Navigations.map(({ name, href, id, emoji }) => (
              <Link
                href={href}
                key={id}
                className="flex items-center gap-1.5 text-foreground/35 hover:text-foreground/60 transition-colors"
              >
                <Kbd>{emoji}</Kbd>
                <span className="text-[10px] uppercase tracking-widest">
                  {name}
                </span>
              </Link>
            ))}
          </div>

          <FeedbackComponent />
        </Stack>
      </div>
    </Container>
  );
};

export default HomePage;
