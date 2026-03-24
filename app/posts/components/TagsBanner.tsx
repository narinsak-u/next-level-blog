"use client";

import Link from "next/link";
import { TagSchemaType } from "@/types";

type Props = {
  tags: TagSchemaType;
};

const TagsBanner = ({ tags }: Props) => {
  return (
    <div className="flex flex-wrap gap-y-[3px] gap-x-[10px] text-xs">
      {Object.entries(tags).map((tag) => (
        <Link
          key={tag[0]}
          href={`/tags/${tag[0]}`}
          className="cursor-pointer text-foreground/50 hover:text-orange-500 dark:hover:text-orange-400 font-medium text-xs leading-relaxed transition-colors duration-200"
        >
          {`#${tag[0]}(${tag[1]})`}
        </Link>
      ))}
    </div>
  );
};

export default TagsBanner;
