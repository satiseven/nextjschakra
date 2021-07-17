import { fetchExchange, dedupExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  CheckLoginDocument,
  CheckLoginQuery,
  LoginMutation,
  LogoutMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
export const createUrqlClient = (ssrExchange: any) => ({
  url: `http://localhost:4000/graphql`,
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result: LoginMutation, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, CheckLoginQuery>(
              cache,
              { query: CheckLoginDocument },
              _result,
              () => ({ checkLogin: null })
            );
          },
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
    ssrExchange,
    fetchExchange,
  ],
});
