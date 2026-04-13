import { IconBrandGithub } from "@tabler/icons-react";
import XLogoIcon from "@/components/icons/x";
import SteamLogoIcon from "@/components/icons/steam";
import { siteMetadata } from "@/site/siteMetadata";
import ShortcutList from "@/components/ui/ShortcutList";

const MainFooter = () => {
  const socialLinks = [
    {
      id: "github",
      icon: <IconBrandGithub className="size-6" />,
      href: siteMetadata.github,
      target: "_blank",
    },
    {
      id: "x",
      icon: <XLogoIcon className="size-6" />,
      href: siteMetadata.socials.x,
      target: "_blank",
    },
    {
      id: "steam",
      icon: <SteamLogoIcon className="size-6" />,
      href: siteMetadata.socials.steam,
      target: "_blank",
    },
  ];

  return (
    <div className="absolute bottom-[calc(var(--inset)+0.8rem)] md:bottom-[calc(var(--inset)+1.5rem)] left-1/2 -translate-x-1/2">
      <ShortcutList items={socialLinks} gap="gap-6" />
    </div>
  );
};

export default MainFooter;
