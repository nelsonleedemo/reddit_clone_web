import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
  //   Equivalent: post: PostsQuery["posts"]["posts"][0];
  /*
      Objective is to get the field "points" here
      We can pass "points" directly
      However, getting post here can reduce # changes required when we make changes on post type
      which is quite common in a graphQL development

      While if you want to write a test for this component, you will need to pass the whole post
    */
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  //   const [{ fetching, operation }, vote] = useVoteMutation();
  //   operation can be shown after fetching success to get all the info like MutationVariable

  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoadingState("updoot-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        variant="ghost"
        colorScheme={post.voteStatus === 1 ? "green": "gray"}
        aria-label="Updoot post"
        icon={<ChevronUpIcon w={post.voteStatus === 1 ? "36px": "24px"} h={post.voteStatus === 1 ? "36px": "24px"} />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoadingState("downdoot-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        variant="ghost"
        colorScheme={post.voteStatus === -1 ? "red": "gray"}
        aria-label="Downdoot post"
        icon={<ChevronDownIcon w={post.voteStatus === -1 ? "36px": "24px"} h={post.voteStatus === -1 ? "36px": "24px"} />}
      />
    </Flex>
  );
};

export default UpdootSection;
