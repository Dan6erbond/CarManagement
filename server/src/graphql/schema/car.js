import { gql } from "apollo-server-express";
import Knex from "knex";

export const typeDef = gql`
  extend type Query {
    car(id: Int!): Car
  }

  type Car {
    id: ID!
    model: String!
    pricePerDay: Float!
  }
`;

export const resolvers = {
  Query: {
    /**
     *
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {number} args.id The car ID to query for.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     */
    car: async (_, { id }, { db }) => {
      const car = await db.first("*").from("cars").where({ id });
      return car;
    },
  },
  Car: {},
};
