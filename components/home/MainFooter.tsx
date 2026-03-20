// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";
import XLogoIcon from "@/components/icons/x";
import SteamLogoIcon from "@/components/icons/steam";
import Link from "next/link";
import { siteMetadata } from "@/site/siteMetadata";
import { Github } from "lucide-react";

// import { ActionIcon } from '@mantine/core';

const MainFooter = () => {
  return (
    <div className="flex gap-6 items-center absolute bottom-[calc(var(--inset)+0.8rem)] md:bottom-[calc(var(--inset)+1.5rem)] left-1/2 -translate-x-1/2">
      <Link
        target="_blank"
        className={buttonVariants({ size: "icon-xl" })}
        href={siteMetadata.github}
      >
        {/* <GitHubLogoIcon className="size-6" /> */}
        <Github className="size-6" />
      </Link>
      <Link
        target="_blank"
        className={buttonVariants({ size: "icon-xl" })}
        href={siteMetadata.socials.x}
      >
        <XLogoIcon className="size-6" />
      </Link>
      <Link
        target="_blank"
        className={buttonVariants({ size: "icon-xl" })}
        href={siteMetadata.socials.steam}
      >
        <SteamLogoIcon className="size-6" />
      </Link>
    </div>
  );
};

export default MainFooter;
