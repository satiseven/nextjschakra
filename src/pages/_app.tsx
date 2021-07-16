import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient, fetchExchange, dedupExchange } from "urql";
import theme from "../theme";
import { AppProps } from "next/app";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import {
  CheckLoginDocument,
  CheckLoginQuery,
  LoginMutation,
  Query,
  useCheckLoginQuery,
} from "../generated/graphql";
import { QueryResult } from "@urql/exchange-graphcache/dist/types/operations/query";
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
const client = createClient({
  url: `http://localhost:4000/graphql`,
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result: LoginMutation, args, cache, info) => {
            betterUpdateQuery<LoginMutation, CheckLoginQuery>(
              cache,
              { query: CheckLoginDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  //  return { checkLogin: result.login.user };
                  return {
                    checkLogin: {
                      email: result.login.user.email,
                      name: result.login.user.name,
                      username: result.login.user.name,
                    },
                  };
                  //TODO
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
