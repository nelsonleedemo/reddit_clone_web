import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  // Stop querying me if SSR, becoz it will return null only
  let body = null;

  // console.log("data:", data)

  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <Flex align="center">
        <NextLink href="/login">
          <Link color="white" mr={4}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </Flex>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button colorScheme="teal" variant="outline" mr={4}>
            Create Post
          </Button>
        </NextLink>

        <Box mr={4}>{data.me.username}</Box>

        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4} align="center">
      <Flex m="auto" flex={1} maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>RedditClone</Heading>
          </Link>
        </NextLink>
        <Flex ml={"auto"} align="center">
          {body}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NavBar;
