import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
import { resolvers as carResolvers, typeDef as Car } from "./car";
import { resolvers as makeResolvers, typeDef as Make } from "./make";

const Query = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = {
  Query: {},
};

export const schema = makeExecutableSchema({
  typeDefs: [Query, Car, Make],
  resolvers: merge(resolvers, carResolvers, makeResolvers),
});
