import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import NavBar from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import {
  useForgetPasswordMutation,
  useLoginMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface fotgetPasswrdProps {}

const forgetPassword = (props: fotgetPasswrdProps) => {
  const route = useRouter();
  const [, login] = useLoginMutation();
  const [complete, setComplete] = React.useState<Boolean>(false);
  const [, forgetPass] = useForgetPasswordMutation();
  return (
    <div>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await forgetPass(values);
            setComplete(true);
            console.log(response);

            //  route.push("/");
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                if an account with that email exists,we sent you an email
              </Box>
            ) : (
              <Form>
                <Box mt={5}>
                  <InputField label="Email" name="email" type="emails" />
                </Box>

                <Button
                  type="submit"
                  mt={4}
                  isLoading={isSubmitting}
                  variant="outline"
                  colorScheme="facebook"
                >
                  Forget Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </div>
  );
};
export default withUrqlClient(createUrqlClient)(forgetPassword);
