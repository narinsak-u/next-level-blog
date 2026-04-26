"use client";

import { siteMetadata } from "@/site/siteMetadata";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="py-8 px-4">
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3",
          "text-xs text-foreground/40 uppercase tracking-widest"
        )}
      >
        <span>{`© ${new Date().getFullYear()}`}</span>
        <span className="hidden sm:inline text-foreground/20">•</span>
        <a
          href={siteMetadata.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition-colors duration-200"
        >
          {siteMetadata.title}
        </a>
        <span className="hidden sm:inline text-foreground/20">•</span>
        <div className="flex items-center gap-2">
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            Next.js
          </a>
          <span className="text-foreground/20">+</span>
          <a
            href="https://mantine.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            Mantine
          </a>
          <span className="text-foreground/20">+</span>
          <a
            href="https://www.notion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            Notion
          </a>
        </div>
        <span className="hidden sm:inline text-foreground/20">•</span>
        <a
          href={siteMetadata.githubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition-colors duration-200"
        >
          {siteMetadata.version}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
