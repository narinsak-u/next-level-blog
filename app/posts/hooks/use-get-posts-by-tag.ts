import { useMemo } from "react";
import { PageDataSchemaType } from "@/types";
import { filterPostsByTag } from "@/lib/post-logic";

type Props = {
  posts: PageDataSchemaType[];
  tagname: string;
};

const useGetPostsByTag = ({ posts, tagname }: Props) => {
  const filteredPosts = useMemo(
    () => filterPostsByTag(posts, tagname),
    [tagname, posts]
  );

  return { filteredPosts };
};

export default useGetPostsByTag;
