"use client";

import { AnimatePresence } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const AnimatePresenceGuard = ({ children }: Props) => {
  return (
    <AnimatePresence mode="popLayout" propagate>
      {children}
    </AnimatePresence>
  );
};

export default AnimatePresenceGuard;
