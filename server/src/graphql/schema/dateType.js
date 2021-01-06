import { gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

export const typeDef = gql`
  scalar Date
`;

const dateType = new GraphQLScalarType({
  name: "Date",
  description: "A date object serialized as milliseconds.",
  /**
   * Serializes the given Date for GraphQL.
   * @param {Date} value The value to be serialized.
   */
  serialize: (value) => value.getTime(),
  /**
   * Parse milliseconds to the Date type from GraphQL inputs.
   * @param {number} value The value which will be converted to a date.
   */
  parseValue: (value) => new Date(value),
});

export const resolvers = {
  Date: dateType,
};
