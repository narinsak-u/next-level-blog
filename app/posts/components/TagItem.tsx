"use client";

import Link from "next/link";
import type { PostTagSchemaType } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  tags: PostTagSchemaType[];
};

const TagItem = ({ tags }: Props) => {
  return (
    <div className="flex flex-wrap gap-1 items-center mt-1 text-xs">
      {tags?.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.name}`}
          className={cn(
            "no-underline text-gray-400 dark:text-gray-500",
            "hover:text-orange-500 dark:hover:text-orange-400",
            "cursor-pointer transition-colors"
          )}
        >
          {`#${tag.name}`}
        </Link>
      ))}
    </div>
  );
};

export default TagItem;
