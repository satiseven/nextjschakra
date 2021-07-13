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
import { useMutation } from "urql";
interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useMutation(`
  mutation Register($username:String!,$password:String!,$name:String!,$email:String!){
    register(options:{name:$username,email:$email,username:$username,password:$password
    }){
      errors{
        field
        message
      }, 
      user{
        email
        id
      }
    }
  }
  `);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "", name: "" }}
        onSubmit={(values) => {
          return register(values);
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
  );
};

export default Register;
