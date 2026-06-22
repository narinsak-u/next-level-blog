"use cleint";

import Link from "next/link";
import {
  Box,
  Card,
  Image,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";

import { useViewportSize } from "@mantine/hooks";
import { PageDataSchemaType } from "@/types";
import Loader from "@/components/common/Loader";

type Props = {
  post: PageDataSchemaType;
};

const MorePost = ({ post }: Props) => {
  const { width } = useViewportSize();
  const { colorScheme } = useMantineColorScheme();

  const bgColor =
    colorScheme === "dark"
      ? "var(--mantine-color-orange-light)"
      : "var(--mantine-color-orange-5)";

  if (!post) return <Loader />;

  return (
    <Tooltip
      disabled={width < 800}
      label={post.title}
      color="orange"
      position="bottom"
      withArrow
      arrowPosition="center"
      transitionProps={{ transition: "slide-up", duration: 300 }}
      style={{
        color: "white",
        backgroundColor: bgColor,
      }}
    >
      <Box>
        <Link href={`/posts/${post.id}`} passHref>
          <Card
            component="div"
            shadow="md"
            className="rounded-sm mt-4 cursor-pointer hover:translate-y-[-8px] transition-transform ease-in-out duration-300"
          >
            <Card.Section>
              <Card.Section>
                <Image
                  src={post.coverImage}
                  alt="post image"
                  className="object-cover"
                  // className="h-[120px] md:h-[180px] object-cover"
                />
              </Card.Section>
            </Card.Section>
          </Card>
        </Link>
      </Box>
    </Tooltip>
  );
};

export default MorePost;
