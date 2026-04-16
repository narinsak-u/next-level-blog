"use client";

import { LazyMotion, AnimatePresence, m, domAnimation } from "framer-motion";
import { ManifestoPanel, useManifesto } from "./ManifestoPanel";
import { Space } from "@mantine/core";
import { ANIMATION } from "@/lib/constants";
import { siteMetadata } from "@/site/siteMetadata";
import { Navigations, MainKeys } from "@/site/data";
import ShortcutList from "@/components/ui/ShortcutList";
import KeyShortcuts from "@/app/posts/components/KeyShortcuts";

/**
 * MainProfile - Primary landing page hero section
 *
 * Renders the blog owner's intro with:
 * - Animated title with layout transition
 * - ManifestoPanel for expandable "about me" content
 * - Nested panel animations via LazyMotion for bundle size optimization
 *
 * Uses `LazyMotion` with `domAnimation` to tree-shake unused motion features,
 * reducing framer-motion bundle by ~30kb.
 *
 * @see ManifestoPanel - Compound component for the intro panel
 * @see ANIMATION - Shared timing constants for all animations
 */

const MainProfile = () => {
  return (
    <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
      <LazyMotion features={domAnimation}>
        <m.div
          layout="position"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION.DURATION,
            ease: ANIMATION.EASE_OUT,
          }}
        >
          <KeyShortcuts items={MainKeys} />
          <Space h="lg" />
          <h1 className="font-serif leading-tight tracking-widest text-4xl font-extrabold short:lg:text-8xl lg:text-8xl sm:text-6xl text-foreground">
            {siteMetadata.cnName}
          </h1>
        </m.div>
      </LazyMotion>

      <div className="flex flex-col mb-12 items-center min-h-0 shrink w-full">
        <ManifestoPanel>
          <IntroPanel />
          {/*<ManifestoPanel.Trigger />
          <ManifestoPanel.Content>
            <article className="relative text-white overflow-y-auto pretty-scrollbar italic p-6 h-full [&_p]:my-4">
              {siteMetadata.home.manifesto.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
          </ManifestoPanel.Content>*/}

          <Space h="xl" />
          <ShortcutList
            items={Navigations.map((nav) => ({
              id: nav.id,
              keys: [nav.emoji],
              label: nav.name,
              href: nav.href,
            }))}
          />
        </ManifestoPanel>
      </div>
    </div>
  );
};

const IntroPanel = () => {
  const { isOpen } = useManifesto();

  return (
    <AnimatePresence>
      {!isOpen ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -6,
            transition: { duration: 0.2, ease: [0.4, 0, 0.6, 1] },
          }}
          transition={{
            delay: ANIMATION.DELAY,
            duration: ANIMATION.DURATION,
            ease: ANIMATION.EASE_OUT,
          }}
        >
          <div className="flex flex-col gap-4 w-full max-w-xl md:gap-6 lg:gap-8">
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: ANIMATION.DURATION,
                ease: ANIMATION.EASE_OUT,
                delay: ANIMATION.DELAY + 0.1,
              }}
              className="text-base short:lg:text-lg sm:text-lg font-medium text-center text-foreground text-pretty"
            >
              {siteMetadata.home.intro.zh}
              <br />
              <span className="text-sm">{siteMetadata.home.intro.en}</span>
            </m.p>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MainProfile;
