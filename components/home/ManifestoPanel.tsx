"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button as CNButton, buttonVariants } from "@/components/ui/button";
import { LazyMotion, AnimatePresence, m, domAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ANIMATION } from "@/lib/constants";
import { siteMetadata } from "@/site/siteMetadata";

/**
 * Context value for ManifestoPanel state management
 * @internal
 */
interface ManifestoContextValue {
  /** Whether the panel content is visible */
  isOpen: boolean;
  /** Opens the manifesto panel */
  open: () => void;
  /** Closes the manifesto panel */
  close: () => void;
  /** Toggles panel visibility */
  toggle: () => void;
}

const ManifestoContext = createContext<ManifestoContextValue | null>(null);

/**
 * ManifestoPanel - Compound component for expandable intro/manifesto content
 *
 * Renders a collapsible panel with:
 * - Trigger button that slides text when open
 * - Animated content reveal with backdrop blur
 * - Close button and Escape key support
 *
 * @example
 * ```tsx
 * <ManifestoPanel>
 *   <IntroContent />
 *   <ManifestoPanel.Trigger>Read More</ManifestoPanel.Trigger>
 *   <ManifestoPanel.Content>
 *     <ManifestoPanel.CloseButton />
 *     <LongText />
 *   </ManifestoPanel.Content>
 * </ManifestoPanel>
 * ```
 */
interface ManifestoPanelProps {
  children: ReactNode;
}

const ManifestoPanel = ({ children }: ManifestoPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <ManifestoContext.Provider value={{ isOpen, open, close, toggle }}>
        {children}
      </ManifestoContext.Provider>
    </LazyMotion>
  );
};

/**
 * Trigger button that opens the manifesto panel
 * Displays inside the panel; text slides left when panel opens
 * @see ManifestoPanel - Parent compound component
 */
interface ManifestoTriggerProps {
  children?: ReactNode;
  className?: string;
}

const ManifestoTrigger = ({ children, className }: ManifestoTriggerProps) => {
  const { isOpen, toggle } = useManifesto();

  return (
    <m.div
      layout="position"
      transition={ANIMATION.SPRING}
      key="button"
      className={cn(isOpen ? "my-6" : "mt-6", className)}
    >
      <CNButton className={cn("relative px-8 cursor-pointer")} onClick={toggle}>
        <m.span
          animate={{ x: isOpen ? -16 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="inline-block"
        >
          {children || siteMetadata.home.manifesto.trigger}
        </m.span>

        <AnimatePresence>
          {isOpen && (
            <m.div
              className={cn(
                buttonVariants({ variant: "iconButton", size: "icon" }),
                "absolute -top-px -right-px aspect-square cursor-pointer"
              )}
              initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 22 } }}
              exit={{ opacity: 0, scale: 0.4, rotate: 90, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
            >
              <X className="size-5 text-primary-foreground" />
            </m.div>
          )}
        </AnimatePresence>
      </CNButton>
    </m.div>
  );
};

/**
 * Animated container for manifesto panel content
 * Only renders children when panel is open (returns null otherwise)
 * @see ManifestoPanel - Parent compound component
 */
interface ManifestoContentProps {
  children: ReactNode;
  className?: string;
}

const ManifestoContent = ({ children, className }: ManifestoContentProps) => {
  const { isOpen } = useManifesto();

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { type: "spring", stiffness: 200, damping: 28, mass: 0.8 },
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.25, ease: [0.4, 0, 0.6, 1] },
              opacity: { duration: 0.12, ease: [0.4, 0, 1, 1] },
            },
          }}
          className="overflow-hidden"
        >
          <m.div
            initial={{ y: 12 }}
            animate={{
              y: 0,
              transition: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 },
            }}
            className={cn(
              "relative font-semibold flex min-h-0 shrink overflow-hidden text-md md:text-lg max-h-[calc(70dvh-var(--footer-safe-area))] flex-col gap-8 text-center text-balance max-w-3xl text-foreground",
              "bg-white/10 dark:bg-white/8 backdrop-blur-2xl",
              "border border-white/15 ring-1 ring-orange-500/10",
              "shadow-2xl shadow-black/30",
              className
            )}
          >
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Close button positioned in top-right corner of content area
 * Alternative to pressing Escape key
 * @see ManifestoPanel - Parent compound component
 */
interface ManifestoCloseButtonProps {
  className?: string;
}

const ManifestoCloseButton = ({ className }: ManifestoCloseButtonProps) => {
  const { close } = useManifesto();

  return (
    <button
      onClick={close}
      className={cn(
        "absolute top-4 right-4 p-2 hover:bg-white/10 transition-colors",
        className
      )}
      aria-label="Close manifesto"
    >
      <X className="size-5" />
    </button>
  );
};

const useManifesto = (): ManifestoContextValue => {
  const context = useContext(ManifestoContext);
  if (!context) {
    throw new Error("useManifesto must be used within ManifestoPanel");
  }
  return context;
};

ManifestoPanel.Trigger = ManifestoTrigger;
ManifestoPanel.Content = ManifestoContent;
ManifestoPanel.CloseButton = ManifestoCloseButton;
ManifestoPanel.displayName = "ManifestoPanel";

export {
  ManifestoPanel,
  ManifestoTrigger,
  ManifestoContent,
  ManifestoCloseButton,
  useManifesto,
};
export type {
  ManifestoPanelProps,
  ManifestoTriggerProps,
  ManifestoContentProps,
  ManifestoCloseButtonProps,
  ManifestoContextValue,
};
