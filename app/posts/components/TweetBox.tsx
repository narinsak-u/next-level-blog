"use client";

import { Tweet } from "react-tweet";

type Props = {
  id: string;
};

const TweetBox = ({ id }: Props) => {
  return <Tweet id={id} />;
};

export default TweetBox;
