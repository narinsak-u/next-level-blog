"use client";

import Link from "next/link";

const Menu = () => {
  return (
    <div className="mt-6 md:mt-8 flex items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base">
      <Link
        href="/posts"
        className="text-foreground/80 hover:text-foreground transition-colors decoration-border/50"
        aria-label="Go to Posts"
      >
        Posts
      </Link>
      <Link
        href="/hobbies"
        className="text-foreground/80 hover:text-foreground transition-colors decoration-border/50"
        aria-label="Go to Hobbies"
      >
        Hobbies
      </Link>
      <Link
        href="/note"
        className="text-foreground/80 hover:text-foreground transition-colors decoration-border/50"
        aria-label="Go to Notes"
      >
        Notes
      </Link>
    </div>
  );
};

export default Menu;
