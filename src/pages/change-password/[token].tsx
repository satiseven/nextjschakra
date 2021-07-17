import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(token);

          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data.changePassword.errors) {
            setErrors(toErrorMap(response.data.changePassword.errors));
          } else if (response.data.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={5}>
              <InputField
                label="New Password"
                type="password"
                name="newPassword"
              />
            </Box>

            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              variant="outline"
              colorScheme="facebook"
            >
              reset password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
ChangePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};
export default withUrqlClient(createUrqlClient)(ChangePassword);
