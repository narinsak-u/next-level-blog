"use client";

import Link from "next/link";
import { Center } from "@mantine/core";
import { siteMetadata } from "@/site/siteMetadata";
import { RocketIcon } from "../icons/Icons";

const IconLogo = () => (
  <Link href="/" className="inline-flex gap-2.5 items-center cursor-pointer">
    <span style={{ fontSize: "20px" }}>
      <RocketIcon />
    </span>
    <div style={{ fontWeight: "bold" }}>{siteMetadata.title}</div>
  </Link>
);

const Logo = () => {
  return (
    <Center
      inline
      style={{
        display: "flex",
        margin: "2rem 0 1rem",
      }}
    >
      <IconLogo />
    </Center>
  );
};

export default Logo;
