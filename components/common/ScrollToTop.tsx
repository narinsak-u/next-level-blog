"use client";

import { ArrowUpCircle, Feather, Books } from "tabler-icons-react";
import { IconHome } from "@tabler/icons-react";
import { siteMetadata } from "@/site/siteMetadata";
import { FloatingButtonGroup } from "@/components/ui/FloatingButton";
import { useRouter } from "next/navigation";

const ScrollToTop = () => {
  const router = useRouter();

  return (
    <FloatingButtonGroup className="md:!right-6 lg:!right-14 md:!bottom-4">
      <FloatingButtonGroup.Button
        icon={ArrowUpCircle}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        label="Scroll to top"
      />
      <FloatingButtonGroup.Button
        icon={Books}
        onClick={() => router.push("/posts")}
        label="Go to posts"
      />
      <FloatingButtonGroup.Button
        icon={Feather}
        href={siteMetadata.feedbackUrl}
        external
        label="Give feedback"
      />
      <FloatingButtonGroup.Button
        icon={IconHome}
        onClick={() => router.push("/")}
        label="Go to home"
      />
    </FloatingButtonGroup>
  );
};

export default ScrollToTop;
