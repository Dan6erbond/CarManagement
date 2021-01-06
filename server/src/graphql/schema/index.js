import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
import { resolvers as carResolvers, typeDef as Car } from "./car";
import { resolvers as makeResolvers, typeDef as Make } from "./make";
import { resolvers as dateTypeResolvers, typeDef as DateType } from "./dateType";
import { resolvers as rentalResolvers, typeDef as Rental } from "./rental";

const Query = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = {
  Query: {},
};

export const schema = makeExecutableSchema({
  typeDefs: [Query, Car, Make, DateType, Rental],
  resolvers: merge(resolvers, carResolvers, makeResolvers, dateTypeResolvers, rentalResolvers),
});
