"use client";

import { ActionIcon, Box, Center, Text } from "@mantine/core";
import { BrandFacebook } from "tabler-icons-react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { TwitterIcon } from "@/components/icons/Icons";

const shareButtonStyles = {
  color: "orange" as const,
  size: "lg" as const,
  radius: "sm" as const,
  variant: "filled" as const,
  className: "!bg-orange-500 dark:!bg-amber-900",
};

interface FacebookShareButtonProps {
  url: string;
  hashtag?: string;
}

const FacebookShareButtonExplicit = ({ url, hashtag }: FacebookShareButtonProps) => (
  <Box className="flex justify-center items-center mb-3">
    <ActionIcon component="div" {...shareButtonStyles}>
      <FacebookShareButton
        hashtag={hashtag}
        url={url}
        style={{ display: "grid", placeItems: "center" }}
      >
        <BrandFacebook size={18} className="dark:text-white" />
      </FacebookShareButton>
    </ActionIcon>
  </Box>
);

interface TwitterShareButtonProps {
  url: string;
  hashtag?: string;
  title?: string;
}

const TwitterShareButtonExplicit = ({ url, hashtag, title }: TwitterShareButtonProps) => (
  <Box className="flex justify-center items-center mb-3">
    <ActionIcon component="div" {...shareButtonStyles}>
      <TwitterShareButton
        url={url}
        title={title || "New post, let's explore"}
        hashtags={hashtag ? [hashtag] : ["#alohadancemeow"]}
        style={{ display: "grid", placeItems: "center" }}
      >
        <TwitterIcon />
      </TwitterShareButton>
    </ActionIcon>
  </Box>
);

interface ShareButtonProps {
  platform: "facebook" | "twitter";
  url: string;
  hashtag?: string;
  title?: string;
}

const ShareButton = ({ platform, url, hashtag, title }: ShareButtonProps) => {
  if (platform === "facebook") {
    return <FacebookShareButtonExplicit url={url} hashtag={hashtag} />;
  }
  return <TwitterShareButtonExplicit url={url} hashtag={hashtag} title={title} />;
};

interface ShareGroupProps {
  children?: React.ReactNode;
  postLink: string;
  hashtag?: string;
  title?: string;
}

const ShareGroup = ({
  children,
  postLink,
  hashtag,
  title,
}: ShareGroupProps) => {
  return (
    <div className="hidden absolute md:flex md:left-[-35px] lg:left-[-50px]">
      <Center>
        <Box className="flex flex-col mt-2">
          <Text tt="uppercase" c="dimmed">
            Share
          </Text>
          <div className="bg-orange-500! dark:bg-amber-900! my-3 p-0 h-20 w-[2px] mx-auto" />
          {children || (
            <>
              <ShareButton platform="facebook" url={postLink} hashtag={hashtag} />
              <ShareButton platform="twitter" url={postLink} hashtag={hashtag} title={title} />
            </>
          )}
        </Box>
      </Center>
    </div>
  );
};

ShareGroup.Button = ShareButton;
ShareGroup.displayName = "ShareGroup";
ShareButton.displayName = "ShareButton";

export { ShareButton, ShareGroup };
export type { ShareButtonProps, ShareGroupProps };
