"use client";

import Link from "next/link";
import { siteMetadata } from "@/site/siteMetadata";
import { RocketIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <div className="flex justify-center mt-6 mb-4">
      <Link
        href="/"
        aria-label={`${siteMetadata.title} — Home`}
        className={cn(
          "inline-flex gap-2 items-center",
          "text-foreground/80 hover:text-orange-500 transition-colors duration-200",
          "text-sm font-semibold uppercase tracking-widest"
        )}
      >
        <span className="opacity-70">
          <RocketIcon />
        </span>
        {siteMetadata.title}
      </Link>
    </div>
  );
};

export default Logo;
