"use client";

import { Container, Divider, Space } from "@mantine/core";
import Shortcuts from "./Shortcuts";
import CustomBlockquote from "./CustomBlockquote";

import FirstContent from "../contents/content-1.mdx";

type Props = {
  children: React.ReactNode;
};

const NotePage = ({ children }: Props) => {
  return (
    <>
      <Space h={"lg"} />
      <Container size={"sm"} className="my-0 mx-2 md:m-auto">
        <Shortcuts />
        <Space h={"xl"} />
        <Space h={"sm"} />
        <CustomBlockquote
          cite="3rd rabbit The caffeine-driven man"
          quote="The only way to gain knowledge is to be aware of everything around you. ✌️"
        />
        <Space h={"lg"} />

        <div>
          <Divider label="Content from Notion" labelPosition="center" />
          {children}
          <Space h={"lg"} />
          <Divider label="Content from .mdx" labelPosition="center" />
          <Space h={"lg"} />
          <div className="prose">
            <FirstContent />
          </div>
        </div>

        <Space h={"lg"} />
        <Divider />
        <Space h={"lg"} />
      </Container>
    </>
  );
};

export default NotePage;
