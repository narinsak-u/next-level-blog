"use client";

import { Container, Center, Stack, Divider } from "@mantine/core";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <Center
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Stack className="m-0 w-full md:mx-8">
          {/* <Divider my="md" /> */}
          {children}
        </Stack>
      </Center>
    </Container>
  );
};

export default PageLayout;
