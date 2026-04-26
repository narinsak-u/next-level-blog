"use client";

import { Container, Divider, Space } from "@mantine/core";
import CustomBlockquote from "./CustomBlockquote";
import FirstContent from "../contents/content-1.mdx";
import dynamic from "next/dynamic";

const PostHeatmap = dynamic(() => import("./PostHeatmap"), { ssr: false });

type Props = {
  children: React.ReactNode;
  data: {
    dates: Record<string, number>;
    years: number[];
  };
};

const NotePage = ({ children, data }: Props) => {
  return (
    <>
      <Container className="my-0 mx-2 md:m-auto w-full">
        <CustomBlockquote
          cite="3rd rabbit The caffeine-driven man"
          quote="The only way to gain knowledge is to be aware of everything around you. ✌️"
        />
        <Space h={"lg"} />
        <Space h={"lg"} />

        <div>
          <Divider label="Content from Notion" labelPosition="center" />
          {children}
          <Space h={"lg"} />
          <Divider label="Content from .mdx" labelPosition="center" />
          <Space h={"lg"} />
          <div className="prose w-full max-w-none">
            <FirstContent />
          </div>
          <Space h={"lg"} />
          <Space h={"lg"} />
          <Divider label="Stats" labelPosition="center" />
          <Space h={"lg"} />
          <PostHeatmap initialData={data} />
        </div>

        <Space h={"lg"} />
        <Divider />
        <Space h={"lg"} />
      </Container>
    </>
  );
};

export default NotePage;
