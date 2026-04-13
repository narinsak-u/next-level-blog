"use client";

import Link from "next/link";
import Kbd from "./Kbd";

interface ShortcutItem {
  id: string;
  keys: string[];
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ShortcutListProps {
  items: ShortcutItem[];
  gap?: string;
}

const ShortcutList = ({ items, gap = "gap-4" }: ShortcutListProps) => {
  return (
    <div className={`flex items-center justify-center ${gap} py-2`}>
      {items.map(({ id, keys, label, href, onClick }) => {
        const content = (
          <>
            <div className="flex items-center gap-1">
              {keys.map((k, i) => (
                <span key={k} className="flex items-center gap-1">
                  <Kbd>{k}</Kbd>
                  {i < keys.length - 1 && (
                    <span className="text-[10px] text-foreground/40">+</span>
                  )}
                </span>
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-widest">
              {label}
            </span>
          </>
        );

        if (href) {
          return (
            <Link
              href={href}
              key={id}
              className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground/90 transition-colors"
            >
              {content}
            </Link>
          );
        }

        if (onClick) {
          return (
            <button
              key={id}
              onClick={onClick}
              className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground/90 transition-colors"
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={id}
            className="flex items-center gap-1.5 text-foreground/50"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ShortcutList;
