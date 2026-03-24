"use client";

import { Box, Divider, Space } from "@mantine/core";
import Logo from "./Logo";
import Footer from "./Footer";
import KeyShortcuts from "@/app/posts/components/KeyShortcuts";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="relative flex flex-col justify-between w-full h-full p-0">
        <Box>
          <Logo />
          <KeyShortcuts />
          {children}
        </Box>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
