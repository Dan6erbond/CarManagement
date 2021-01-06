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
    car(id: ID!): Car
    cars: [Car!]!
  }

  type Car {
    id: ID!
    model: String!
    make: Make!
    pricePerDay: Float!
    rentals: [Rental!]!
  }
`;

export const resolvers = {
  Query: {
    /**
     * Fetch a car by its ID.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {number} args.id The car ID to query for.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {?Car}
     */
    car: async (_, { id }, { db }) => {
      /**
       * @type {?Car}
       */
      const car = await db.first("*").from("cars").where({ id });
      return car;
    },
    /**
     * Fetch all the cars in the database.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {Car[]}
     */
    cars: async (_, __, { db }) => {
      /**
       * @type {Car[]}
       */
      const cars = await db.select("*").from("cars");
      return cars;
    },
  },
  Car: {
    /**
     * Remap the car's price_per_day property to pricePerDay for GraphQL.
     * @param {Car} parent The parent car object.
     * @returns {number}
     */
    pricePerDay: (parent) => parent.price_per_day,
    /**
     * Fetch a car's make.
     * @param {Car} parent The parent car object.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./make").Make}
     */
    make: async (parent, _, { db }) => {
      /**
       * @type {import("./make").Make}
       */
      const make = await db.first("*").from("makes").where({ id: parent.make_id });
      return make;
    },
    /**
     * Fetch all the rentals associated with a car.
     * @param {Car} parent The parent car object.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @return {import("./rental").Rental[]}
     */
    rentals: async (parent, _, { db }) => {
      /**
       * @type {import("./rental").Rental[]}
       */
      const rentals = await db.select("*").from("rentals").where({ car_id: parent.id });
      return rentals;
    },
  },
};
