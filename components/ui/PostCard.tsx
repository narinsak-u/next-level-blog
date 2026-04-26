"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Card, Image, Text } from "@mantine/core";
import type { PageDataSchemaType } from "@/types";
import { SmallFeatherIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

interface PostCardGridProps {
  post: PageDataSchemaType;
  showImage?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
}

interface PostCardListProps {
  post: PageDataSchemaType;
  showDescription?: boolean;
}

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
            "inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
            "bg-orange-500/10 text-orange-500 border border-orange-500/20",
            "dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-400/25"
          )}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

const PostCardGrid = ({
  post,
  showImage = true,
  showTags = true,
  showDescription = true,
}: PostCardGridProps) => (
  <Link href={`/posts/${post.id}`} passHref aria-label={`Read post: ${post.title}`}>
    <Card
      component="div"
      p="md"
      radius={0}
      className={cn(
        "md:h-[420px] cursor-pointer",
        "bg-white/5 dark:bg-white/4 backdrop-blur-md",
        "border border-white/10",
        "hover:bg-white/10 dark:hover:bg-white/8",
        "hover:border-orange-500/30 hover:-translate-y-2",
        "transition-all duration-300 ease-out",
        "shadow-none hover:shadow-lg hover:shadow-black/20"
      )}
    >
      <time dateTime={post.createdTime}>
        <div className="flex gap-2 mb-1 text-xs text-foreground/50 uppercase tracking-wide">
          <SmallFeatherIcon />
          {format(parseISO(post.createdTime), "LLLL d, yyyy")}
        </div>
      </time>

      {showImage && post.coverImage ? (
        <Card.Section>
          <Image
            src={post.coverImage}
            width={400}
            height={180}
            alt={`Cover image for ${post.title}`}
          />
        </Card.Section>
      ) : null}

      {showTags ? <TagItemInline tags={post.tags} /> : null}
      <Text style={{ fontWeight: 500 }} size="md" mt="sm" className="text-foreground">
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

const PostCardList = ({ post, showDescription = true }: PostCardListProps) => (
  <Link href={`/posts/${post.id}`} passHref aria-label={`Read post: ${post.title}`}>
    <div
      className={cn(
        "p-3 cursor-pointer",
        "hover:bg-white/5 dark:hover:bg-white/4",
        "border-l-2 border-l-transparent hover:border-l-orange-500",
        "transition-all duration-200 ease-out"
      )}
    >
      <div className="md:flex justify-between items-center">
        <div className="font-medium text-base flex items-center gap-2 mb-1">
          <SmallFeatherIcon />
          <div>{post.title}</div>
        </div>
        <div className="hidden md:block">
          <time dateTime={post.createdTime}>
            <div className="flex gap-x-2 items-center justify-center text-xs text-foreground/50 uppercase tracking-wide">
              {format(parseISO(post.createdTime), "yyyy-LL-dd")}
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

export { PostCardGrid, PostCardList, TagItemInline };
export type { PostCardGridProps, PostCardListProps, TagItemInlineProps };
