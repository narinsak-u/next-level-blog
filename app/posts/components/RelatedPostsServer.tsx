import { fetchPosts } from "@/app/posts/actions/posts";
import { selectRelatedPosts } from "@/app/posts/helpers/related-posts";
import type { PageDataSchemaType } from "@/types";
import RelatedPosts from "./RelatedPosts";

const RELATED_POST_CANDIDATE_LIMIT = 6;
const RELATED_POST_LIMIT = 3;

type Props = {
  postData: PageDataSchemaType;
};

const RelatedPostsServer = async ({ postData }: Props) => {
  const { items } = await fetchPosts({
    category: postData.category || undefined,
    pageSize: RELATED_POST_CANDIDATE_LIMIT,
  });
  const relatedPosts = selectRelatedPosts(items, postData, RELATED_POST_LIMIT);

  return <RelatedPosts posts={relatedPosts} postData={postData} />;
};

export default RelatedPostsServer;
