import { cn } from "@/lib/utils";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

const Kbd = ({ children, className }: KbdProps) => (
  <kbd
    className={cn(
      "inline-flex items-center px-1.5 py-0.5",
      "text-[10px] font-medium uppercase tracking-wide",
      "bg-white/5 border border-white/15 text-foreground/50",
      className
    )}
  >
    {children}
  </kbd>
);

export default Kbd;