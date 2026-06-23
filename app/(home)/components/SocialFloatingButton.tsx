"use client";

import { ActionIcon, Box } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { siteMetadata } from "@/site/siteMetadata";
import { IconBrandGithub } from "@tabler/icons-react";
import XLogoIcon from "@/components/icons/x";
import SteamLogoIcon from "@/components/icons/steam";
import type { ComponentType } from "react";

interface SocialLink {
  Icon: ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { Icon: IconBrandGithub, href: siteMetadata.github, label: "GitHub" },
  { Icon: XLogoIcon, href: siteMetadata.socials.x, label: "X" },
  { Icon: SteamLogoIcon, href: siteMetadata.socials.steam, label: "Steam" },
];

const SocialFloatingButton = () => {
  const { width } = useViewportSize();

  if (width < 500) {
    return null;
  }

  return (
    <Box
      className="fixed z-50 flex flex-col items-center"
      style={{
        right: "2.5rem",
        bottom: "1.5rem",
      }}
    >
      <Box className="flex flex-col gap-3">
        {socialLinks.map(({ Icon, href, label }) => (
          <ActionIcon
            key={label}
            component="a"
            size="lg"
            radius="xs"
            variant="outline"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="social-floating-btn bg-transparent border-white! text-white hover:bg-white/10"
          >
            <Icon className="size-5 text-white" />
          </ActionIcon>
        ))}
        <div className="bg-white h-10 w-0.5 mx-auto" />
      </Box>
    </Box>
  );
};

export default SocialFloatingButton;
