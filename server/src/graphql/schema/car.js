import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A car model.
 * @typedef {Object} Car
 * @property {number} id The car's database ID.
 * @property {number} make_id The car make's database ID.
 * @property {string} model The car's model name.
 * @property {number} price_per_day The price to rent the car per day.
 *
 * The input object provided as GraphQL args to createCar.
 * @typedef {Object} CreateCarInput
 * @property {string} model The model name.
 * @property {string} makeId The make ID to be associated with this vehicle model.
 * @property {number} pricePerDay The price per day to rent this vehicle.
 *
 * The payload returned by createCar.
 * @typedef {Object} CreateCarPayload
 * @property {?Car} car The newly created car.
 * @property {?string} error Errors if any are thrown.
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

  input CreateCarInput {
    model: String!
    makeId: ID!
    pricePerDay: Float!
  }

  type CreateCarPayload {
    car: Car
    error: String
  }

  extend type Mutation {
    createCar(input: CreateCarInput!): CreateCarPayload!
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
     * @param {Object} args Arguments passed to the query.
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
     * @param {Object} args Arguments passed to the query.
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
     * @param {Object} args Arguments passed to the query.
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
  Mutation: {
    /**
     * Create a car object and return the payload.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {CreateCarInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {CreateCarPayload}
     */
    createCar: async (_, { input }, { db }) => {
      const { makeId, pricePerDay, ...carData } = input;

      const make = await db.first("*").from("makes").where({ id: makeId });
      if (!make) {
        return {
          error: `The make by ID ${makeId} does not exist.`,
        };
      }

      const values = { ...carData, price_per_day: pricePerDay, make_id: makeId };
      const [id] = await db.insert(values).into("cars");

      return {
        car: {
          ...values,
          id,
        },
      };
    },
  },
};
