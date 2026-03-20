"use client";

import { ActionIcon, Box, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { cn } from "@/lib/utils";

interface FloatingButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  label: string;
  style?: React.CSSProperties;
}

const FloatingButton = ({
  icon: Icon,
  onClick,
  href,
  external,
  label,
  style,
}: FloatingButtonProps) => {
  return (
    <ActionIcon
      component={href ? (external ? "a" : "button") : "button"}
      color="orange"
      size="lg"
      radius="sm"
      variant="filled"
      onClick={onClick}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="!bg-orange-500 dark:!bg-amber-900"
      style={style}
    >
      <Icon size={20} className="text-black dark:text-white" />
    </ActionIcon>
  );
};

interface FloatingButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  position?: {
    right?: string;
    bottom?: string;
  };
}

const FloatingButtonGroup = ({
  children,
  className,
  position = { right: "1.5rem", bottom: "1rem" },
}: FloatingButtonGroupProps) => {
  const [scroll] = useWindowScroll();

  return (
    <div
      className={cn(
        "hidden md:flex fixed z-50 flex-col items-center",
        className
      )}
      style={{
        right: position.right,
        bottom: position.bottom,
      }}
    >
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <Box className="flex flex-col mt-2">
            <Box className="flex justify-center items-center mb-3">
              <div className="flex flex-col gap-3">{children}</div>
            </Box>
            <div className="bg-orange-500 dark:bg-amber-900 my-3 p-0 h-10 w-[2px] mx-auto" />
          </Box>
        )}
      </Transition>
    </div>
  );
};

FloatingButtonGroup.Button = FloatingButton;
FloatingButtonGroup.displayName = "FloatingButtonGroup";
FloatingButton.displayName = "FloatingButton";

export { FloatingButton, FloatingButtonGroup };
export type { FloatingButtonProps, FloatingButtonGroupProps };
