"use client";

import Link from "next/link";
import Kbd from "./Kbd";

interface ShortcutItem {
  id: string;
  keys?: string[];
  label?: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  target?: string;
}

interface ShortcutListProps {
  items: ShortcutItem[];
  gap?: string;
}

const ShortcutList = ({ items, gap = "gap-4" }: ShortcutListProps) => {
  return (
    <div className={`flex items-center justify-center ${gap} py-2 bg-transparent`}>
      {items.map(({ id, keys, label, icon, href, onClick, target }) => {
        const content = (
          <>
            {icon
              ? icon
              : keys &&
                keys.length > 0 && (
                  <div className="flex items-center gap-1">
                    {keys.map((k, i) => (
                      <span key={k} className="flex items-center gap-1">
                        <Kbd>{k}</Kbd>
                        {i < keys.length - 1 && (
                          <span className="text-[10px] text-foreground/50">
                            +
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
            {label && (
              <span className="text-[10px] uppercase tracking-widest">
                {label}
              </span>
            )}
          </>
        );

        if (href) {
          return (
            <Link
              href={href}
              key={id}
              target={target}
              className="flex items-center gap-1.5  hover:text-foreground/90 transition-colors"
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
              className="flex items-center gap-1.5  hover:text-foreground/90 transition-colors"
            >
              {content}
            </button>
          );
        }

        return (
          <div key={id} className="flex items-center gap-1.5 ">
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ShortcutList;
export type { ShortcutItem };
