"use client";

import { Container, Divider, Space } from "@mantine/core";

const AboutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Container
        className="my-0 md:m-auto w-full justify-center flex"
      >
        <div>{children}</div>
        <Space h={"lg"} />
        <Divider />
        <Space h={"lg"} />
      </Container>
    </>
  );
};

export default AboutPage;
