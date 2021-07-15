import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
interface RegisterProps {}
const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", password: "", email: "", name: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register(values);
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data?.register.errors));
            } else if (response.data?.register.user) {
              router.push("/");
            }
          }}
        >
          {({ errors, values, isSubmitting, handleChange }) => (
            <Form>
              <InputField name="name" placeholder="Name" label="Name" />

              <Box mt={4}>
                <InputField
                  type="email"
                  name="email"
                  placeholder="Email"
                  label="Email"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  type="text"
                  name="username"
                  placeholder="Username"
                  label="Username"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  type="password"
                  name="password"
                  placeholder="Password"
                  label="Password"
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                mt={5}
                variant="outline"
                colorScheme="orange"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default Register;
