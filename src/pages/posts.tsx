import { withUrqlClient } from "next-urql";
import React from "react";
import NavBar from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface PostsProps {}
const posts = (props: PostsProps) => {
  const [{ fetching: postsFetching, data }] = usePostsQuery();
  const postList = postsFetching ? (
    <h1>Fetching...</h1>
  ) : (
    <ul>
      {data.posts.map((item, index) => (
        <li key={`posts_${index}`}>{item.title}</li>
      ))}
    </ul>
  );
  return (
    <>
      <NavBar />
      <Wrapper>{postList}</Wrapper>
    </>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(posts);
