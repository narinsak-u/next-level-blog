"use client";

import { Container } from "@mantine/core";
import Header from "./Header";

type Props = {
  title: string;
};

const Menu = ({ title }: Props) => {
  return (
    <Container>
      <Header title={title} />
    </Container>
  );
};

export default Menu;
