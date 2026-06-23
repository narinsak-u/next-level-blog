import { cn } from "@/lib/utils";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
  mode?: "focused" | "jianghu";
}

const Kbd = ({ children, className, mode = "focused" }: KbdProps) => {
  const isJianghu = mode === "jianghu";
  const textClass = isJianghu ? "text-white/70" : "text-black/70 dark:text-white/70";
  const bgClass = isJianghu ? "bg-white/5 border-white/15" : "bg-white/5 border-white/15";

  return (
    <kbd
      className={cn(
        "inline-flex items-center px-1.5 py-0.5",
        "text-[10px] font-medium uppercase tracking-wide",
        bgClass,
        "border",
        textClass,
        className,
      )}
    >
      {children}
    </kbd>
  );
};

export default Kbd;