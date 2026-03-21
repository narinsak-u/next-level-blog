"use client";

import { Container, Divider, Space } from "@mantine/core";
import CustomBlockquote from "@/app/note/components/CustomBlockquote";

type Props = {
  children: React.ReactNode;
};

const ProjectPage = ({ children }: Props) => {
  return (
    <>
      <Space h={"sm"} />
      <Container size={"sm"} className="my-0 mx-2 md:m-auto w-full">
        <Space h={"sm"} />
        <CustomBlockquote
          cite="Unknown"
          quote="Until it's done, tell none. ✌️"
        />
        <Space h={"xl"} />
        <Divider label="Recent Projects" labelPosition="center" />
        <div>{children}</div>
        <Space h={"lg"} />
        <Space h={"lg"} />
      </Container>
    </>
  );
};

export default ProjectPage;
