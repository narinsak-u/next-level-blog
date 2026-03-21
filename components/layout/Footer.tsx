"use client";

import { siteMetadata } from "@/site/siteMetadata";
import { Center, Text } from "@mantine/core";

const Footer = () => {
  return (
    <div style={{ margin: "2rem 0" }}>
      <Center style={{ fontWeight: "500", gap: "5px" }}>
        <div className="flex flex-col items-center gap-y-1">
          <div className="flex gap-1">
            <Text>Made with 🧡</Text>

            <Text
              pl={8}
              component="a"
              href={`${siteMetadata.github}`}
              target={"_blank"}
              referrerPolicy="no-referrer"
            >
              {siteMetadata.title}
            </Text>
            <Text
              fz={"xs"}
              pl={8}
              color="orange"
              component="a"
              href={`${siteMetadata.githubRepo}`}
              target={"_blank"}
              referrerPolicy="no-referrer"
            >
              {`${siteMetadata.version}`}
            </Text>
          </div>
          <div className="flex gap-1 md:gap-2">
            <Text fz={"xs"} c="dimmed">
              {`©${new Date().getFullYear()} • `}
            </Text>
            <Text fz={"xs"} c="dimmed">
              Powered by
            </Text>
            <Text
              fz={"xs"}
              className="text-neutral-400! hover:text-orange-500!"
              component="a"
              target={"_blank"}
              referrerPolicy="no-referrer"
              href="https://nextjs.org/"
            >
              Next
            </Text>
            <Text fz={"xs"} c="dimmed">
              +
            </Text>
            <Text
              fz={"xs"}
              className="text-neutral-400! hover:text-orange-500!"
              component="a"
              target={"_blank"}
              referrerPolicy="no-referrer"
              href="https://www.notion.com/"
            >
              Notion
            </Text>
            <Text fz={"xs"} c="dimmed">
              +
            </Text>
            <Text
              fz={"xs"}
              className="text-neutral-400! hover:text-orange-500!"
              component="a"
              target={"_blank"}
              referrerPolicy="no-referrer"
              href="https://mantine.dev/"
            >
              Mantine
            </Text>
            <Text>🎉</Text>
          </div>
        </div>
      </Center>
    </div>
  );
};

export default Footer;
