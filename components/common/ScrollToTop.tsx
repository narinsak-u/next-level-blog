"use client";

import { ArrowUpCircle, Feather, Books } from "tabler-icons-react";
import { IconHome, IconSparkles } from "@tabler/icons-react";
import { siteMetadata } from "@/site/siteMetadata";
import { FloatingButtonGroup } from "@/components/ui/FloatingButton";
import { useRouter, usePathname } from "next/navigation";

interface ScrollToTopProps {
  onAISummaryClick?: () => void;
}

const ScrollToTop = ({ onAISummaryClick }: ScrollToTopProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/") && pathname !== "/posts";

  return (
    <FloatingButtonGroup className="md:right-6! lg:right-14! md:bottom-4!">
      <FloatingButtonGroup.Button
        icon={ArrowUpCircle}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        label="Scroll to top"
        tooltip
      />
      {isPostPage && onAISummaryClick && (
        <FloatingButtonGroup.Button
          icon={IconSparkles}
          onClick={onAISummaryClick}
          label="AI Summary"
          tooltip
        />
      )}
      <FloatingButtonGroup.Button
        icon={Books}
        onClick={() => router.push("/posts")}
        label="Go to posts"
        tooltip
      />
      <FloatingButtonGroup.Button
        icon={Feather}
        href={siteMetadata.feedbackUrl}
        external
        label="Give feedback"
        tooltip
      />
      <FloatingButtonGroup.Button
        icon={IconHome}
        onClick={() => router.push("/")}
        label="Go to home"
        tooltip
      />
    </FloatingButtonGroup>
  );
};

export default ScrollToTop;
