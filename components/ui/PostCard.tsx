"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Card, Image, Text } from "@mantine/core";
import type { PageDataSchemaType } from "@/types";
import { SmallFeatherIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

type LayoutVariant = "grid" | "list";

interface PostCardBaseProps {
  post: PageDataSchemaType;
  layout?: LayoutVariant;
  showImage?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
}

const PostCardBase = ({
  post,
  layout = "grid",
  showImage = true,
  showTags = true,
  showDescription = true,
}: PostCardBaseProps) => {
  const isGrid = layout === "grid";

  if (isGrid) {
    return (
      <Link href={`/posts/${post.id}`} passHref>
        <Card
          component="div"
          shadow="md"
          p="md"
          radius={"sm"}
          className={cn(
            "md:h-[420px] hover:bg-orange-200 dark:hover:bg-neutral-700 shadow-md cursor-pointer hover:translate-y-[-8px] transition-transform ease-in-out duration-300"
          )}
        >
          <time dateTime={post.createdTime}>
            <div className="flex gap-2 mb-1">
              <SmallFeatherIcon />
              {format(parseISO(post.createdTime), "LLLL d, yyyy")}
            </div>
          </time>

          {showImage && post.coverImage && (
            <Card.Section>
              <Image src={post.coverImage} height={180} alt="post image" />
            </Card.Section>
          )}

          {showTags && <TagItemInline tags={post.tags} />}
          <Text style={{ fontWeight: 500 }} size="lg" mt={"sm"}>
            {post.title}
          </Text>
          {showDescription && (
            <Text mt="xs" c="dimmed" size="sm" className="line-clamp-3">
              {post.description}
            </Text>
          )}
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.id}`} passHref>
      <div className="p-2 cursor-pointer">
        <div className="md:flex hover:text-orange-400 dark:hover:text-amber-900 justify-between items-center hover:underline transition-transform ease-in-out duration-300">
          <div className="font-medium text-lg flex items-center gap-2 mb-1">
            <SmallFeatherIcon />
            <div>{post.title}</div>
          </div>
          <div className="hidden md:block">
            <time dateTime={post.createdTime}>
              <div className="flex gap-x-2 items-center justify-center">
                {format(parseISO(post.createdTime), "yyyy-LL-dd ")}
              </div>
            </time>
          </div>
        </div>
        {showDescription && (
          <Text c="dimmed" size="sm" className="line-clamp-3">
            {post.description}
          </Text>
        )}
      </div>
    </Link>
  );
};

interface TagItemInlineProps {
  tags: PageDataSchemaType["tags"];
}

const TagItemInline = ({ tags }: TagItemInlineProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={cn(
            "inline-block px-2 py-0.5 text-xs rounded-full",
            "bg-orange-100 text-orange-800 dark:bg-amber-900 dark:text-orange-100"
          )}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export { PostCardBase, TagItemInline };
export type { PostCardBaseProps, TagItemInlineProps, LayoutVariant };
