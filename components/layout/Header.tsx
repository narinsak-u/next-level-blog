import { cn } from "@/lib/utils";

type Props = {
  title: string;
};

const Header = ({ title }: Props) => {
  return (
    <div
      className={cn(
        "py-3 px-4",
        "bg-white/5 backdrop-blur-sm",
        "border border-white/10 border-l-2 border-l-orange-500",
        "text-xs sm:text-sm uppercase tracking-widest font-medium text-foreground/70"
      )}
    >
      {title}
    </div>
  );
};

export default Header;
