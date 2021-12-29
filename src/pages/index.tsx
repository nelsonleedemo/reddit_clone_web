import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";
import NextLink from "next/link";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>you get query failed for some reason</div>;
  }

  return (
    <Layout>
      {/* <Flex align="center">
        <Heading mr="auto">Reddit Clone</Heading>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
      </Flex>
      <br></br> */}
      {fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {/* ! operator after variable to tell ts that this will not be null or undefined */}
          {data!.posts.posts.map((p) =>
            !p ? null : (
              /* Since we invalidate the cache after deletePost, p might be null at this point */
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />

                <Box flex={1}>
                  <NextLink href="/post" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4} mr="auto">
                      {p.textSnippet}
                    </Text>

                    {meData?.me?.id !== p.creator.id ? null : (
                      <Box>
                        <NextLink
                          href="/post/edit/[id]"
                          as={`/post/edit/${p.id}`}
                        >
                          <IconButton
                            mr={4}
                            colorScheme="gray"
                            aria-label="Edit Post"
                            icon={<EditIcon />}
                          />
                        </NextLink>
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete Post"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            deletePost({ id: p.id });
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
                  {/* getting textSnippet that are resolved and handled by backend */}
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
