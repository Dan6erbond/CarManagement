import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A customer's car rental.
 * @typedef {Object} Rental
 * @property {number} id The rental's database ID.
 * @property {number} car_id The car's database ID.
 * @property {number} customer_id The customer's database ID.
 * @property {Date} rental_start The start date of the rental.
 * @property {(?Date)} rental_end The end date of the rental.
 */

export const typeDef = gql`
  extend type Query {
    rentals: [Rental!]!
    rental(id: ID!): Rental
  }

  type Rental {
    id: ID!
    car: Car!
    rentalStart: Date!
    rentalEnd: Date
  }
`;

export const resolvers = {
  Query: {
    /**
     * Fetch all the rentals in the database.
     * @param {Object} _
     * @param {Object} __
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {Rental[]}
     */
    rentals: async (_, __, { db }) => {
      /**
       * @type {Rental[]}
       */
      const rentals = await db.select("*").from("rentals");
      return rentals;
    },
  },
  Rental: {
    /**
     * Fetch the car that belongs to this rental object.
     * @param {Rental} parent The parent rental object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./car").Car[]}
     */
    car: async (parent, _, { db }) => {
      /**
       * @type {import("./car").Car[]}
       */
      const cars = await db.select("*").from("cars").where({ id: parent.car_id });
      return cars;
    },
  },
};
