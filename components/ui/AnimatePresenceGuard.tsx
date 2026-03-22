"use client";

import { AnimatePresence } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const AnimatePresenceGuard = ({ children }: Props) => {
  return <>{children}</>;
};

export default AnimatePresenceGuard;
