"use client";

import { motion } from "framer-motion";
import { ManifestoPanel } from "./ManifestoPanel";
import AnimatePresenceGuard from "@/components/ui/AnimatePresenceGuard";
import Menu from "./Menu";
import { ANIMATION } from "@/lib/constants";

const MainProfile = () => {
  return (
    <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
      <motion.div
        layout="position"
        transition={{ duration: ANIMATION.DURATION, ease: ANIMATION.EASE_OUT }}
      >
        <p className="font-serif uppercase tracking-[0.4em] leading-relaxed text-center text-xs short:lg:text-xs text-foreground">
          Personal Home
        </p>
        <h1 className="font-serif text-4xl italic short:lg:text-8xl lg:text-8xl sm:text-6xl text-foreground">
          Alohadancemeow®
        </h1>
      </motion.div>

      <div className="flex flex-col mb-12 items-center min-h-0 shrink w-full">
        <ManifestoPanel>
          <AnimatePresenceGuard>
            <IntroPanel />
            <ManifestoPanel.Trigger />
            <ManifestoPanel.Content>
              <ManifestoPanel.CloseButton />
              <article className="relative text-white overflow-y-auto pretty-scrollbar italic p-6 h-full [&_p]:my-4">
                <p>Feel pain. Contemplate pain. Accept pain. Know pain.</p>
                <p>
                  Those who do not understand true pain will never understand
                  true peace. I will never forget Yahiko's pain.
                </p>
                <p>And now... this world shall know pain.</p>
                <p>SHINRA TENSEI!!!</p>
              </article>
            </ManifestoPanel.Content>
            <MenuPanel />
          </AnimatePresenceGuard>
        </ManifestoPanel>
      </div>
    </div>
  );
};

const IntroPanel = () => {
  return (
    <motion.div
      key="newsletter"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          delay: ANIMATION.DELAY,
          duration: ANIMATION.DURATION,
          ease: ANIMATION.EASE_OUT,
        },
      }}
    >
      <div className="flex flex-col gap-4 w-full max-w-xl md:gap-6 lg:gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: ANIMATION.DURATION,
            ease: ANIMATION.EASE_OUT,
            delay: ANIMATION.DELAY,
          }}
          className="text-base short:lg:text-lg sm:text-lg font-medium text-center text-foreground text-pretty"
        >
          {`Hi there! I'm Hai — 海 — aka: alohadancemeow`}
          <br />
          {`大家好，我叫海，很高兴认识你们。`}
        </motion.p>
      </div>
    </motion.div>
  );
};

const MenuPanel = () => {
  return (
    <motion.div
      key="menu"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          delay: ANIMATION.DELAY,
          duration: ANIMATION.DURATION,
          ease: ANIMATION.EASE_OUT,
        },
      }}
    >
      <div className="flex flex-col gap-4 w-full max-w-xl md:gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: ANIMATION.DURATION,
            ease: ANIMATION.EASE_OUT,
            delay: ANIMATION.DELAY,
          }}
          className="text-base short:lg:text-lg sm:text-lg lg:text-xl font-medium text-center text-foreground text-pretty"
        >
          <Menu />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainProfile;
