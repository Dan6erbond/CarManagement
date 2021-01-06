import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A car model.
 * @typedef {Object} Car
 * @property {number} id The car's database ID.
 * @property {number} make_id The car make's database ID.
 * @property {string} model The car's model name.
 * @property {number} price_per_day The price to rent the car per day.
 */

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
     * @returns {Car}
     */
    car: async (_, { id }, { db }) => {
      /**
       * @type {Car}
       */
      const car = await db.first("*").from("cars").where({ id });
      return car;
    },
  },
  Car: {
    /**
     * Remap the car's price_per_day property to pricePerDay for GraphQL.
     * @param {Car} parent The parent car object.
     * @returns {number}
     */
    pricePerDay: (parent) => {
      return parent.price_per_day;
    }
  },
};
