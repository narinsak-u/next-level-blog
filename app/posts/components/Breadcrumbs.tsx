"use client";

import {
  Breadcrumbs as MantineBreadcrumbs,
  // Anchor,
  Center,
} from "@mantine/core";
import Link from "next/link";

const items = [
  { title: "HOME", href: "/" },
  { title: "POSTS", href: "/posts" },
].map((item, index) => (
  <Link href={item.href} key={index}>
    {/* <Anchor>{item.title}</Anchor> */}
  </Link>
));

const Breadcrumbs = () => {
  return (
    <Center>
      <MantineBreadcrumbs>{items}</MantineBreadcrumbs>
    </Center>
  );
};

export default Breadcrumbs;
