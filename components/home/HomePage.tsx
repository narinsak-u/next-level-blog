"use client";

import Link from "next/link";
import {
  Container,
  Text,
  UnstyledButton,
  Divider,
  Grid,
  Space,
  Stack,
  Title,
  Box,
  Center,
  Kbd,
  Image,
} from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";

import { Navigations } from "@/site/data";
import FeedbackComponent from "./Feedback";

const HomePage: React.FC = () => {
  const { colorScheme, toggle: toggleColorScheme } = useTheme();

  return (
    <Container>
      <Center
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Stack style={{ margin: "0 auto", paddingLeft: "10px" }}>
          <Box>
            <Image
              src="/image3.gif"
              alt="profile-image"
              className="rounded-full w-48 h-48"
            />
          </Box>

          <Box>
            <Title order={1}>Personal Home</Title>
            <Space h="xs" />
            <Text>Hi there! 👋 I&apos;m Hai — 海 — aka: alohadancemeow ✌️</Text>
          </Box>

          <Divider my="xs" size="xs" variant="solid" />
          <Space h="sm" />

          <Box style={{ width: "70%" }}>
            <Grid grow>
              {Navigations.map(({ name, href, id }) => (
                <Grid.Col span={6} key={id}>
                  <Link href={href} passHref>
                    <UnstyledButton >{name}</UnstyledButton>
                  </Link>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Space h="sm" />

          <Divider
            my="lg"
            variant="solid"
            labelPosition="left"
            label={
              <UnstyledButton
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => toggleColorScheme()}
              >
                <span style={{ fontSize: "20px" }}>
                  {colorScheme === "dark" ? "🌙" : "🌤️"}
                </span>
                <Box ml={5} mr={10}>
                  Switch Mode
                </Box>
                <Kbd>⌘</Kbd>
                <span style={{ margin: "0 5px" }}>+</span>
                <Kbd>D</Kbd>
                <span style={{ margin: "0 10px" }}>/</span>
                <Kbd>Ctrl</Kbd>
                <span style={{ margin: "0 5px" }}>+</span>
                <Kbd>D</Kbd>
              </UnstyledButton>
            }
          />
          <FeedbackComponent />
        </Stack>
      </Center>
    </Container>
  );
};

export default HomePage;
