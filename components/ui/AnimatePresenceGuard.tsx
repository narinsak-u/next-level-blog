"use client";

type Props = {
  children: React.ReactNode;
};

const AnimatePresenceGuard = ({ children }: Props) => {
  return <>{children}</>;
};

export default AnimatePresenceGuard;
