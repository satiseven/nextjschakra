import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useCheckLoginQuery, useLogoutMutation } from "../generated/graphql";
interface NavBarProps {}

const NavBar = ({}: NavBarProps) => {
  const [{ data, fetching }] = useCheckLoginQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
    body = "User is loading ";
  } else if (!data?.checkLogin) {
    body = (
      <div>
        <NextLink href="/login">
          <Link color="whatsapp.300" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="whatsapp.500">Register</Link>
        </NextLink>
      </div>
    );
  } else if (data?.checkLogin) {
    body = (
      <Flex>
        <Box>{data?.checkLogin.email}</Box>
        <Button
          isLoading={logoutFetching}
          variant="link"
          colorScheme="red"
          onClick={() => logout()}
        >
          {" "}
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="darkgoldenrod" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
