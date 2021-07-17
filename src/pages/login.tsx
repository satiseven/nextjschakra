import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import NavBar from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface LoginProps {}

const login = ({}: LoginProps) => {
  const route = useRouter();
  const [, login] = useLoginMutation();
  return (
    <div>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data?.login.errors));
            } else if (response.data?.login.user) {
              route.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box mt={5}>
                <InputField label="Username" name="username" />
              </Box>
              <Box mt={5}>
                <InputField label="Password" name="password" type="password" />
              </Box>
              <Button
                type="submit"
                mt={4}
                isLoading={isSubmitting}
                variant="outline"
                colorScheme="facebook"
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

export default withUrqlClient(createUrqlClient)(login);
