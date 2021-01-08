import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A customer's car rental.
 * @typedef {Object} Rental
 * @property {number} id The rental's database ID.
 * @property {number} car_id The car's database ID.
 * @property {number} customer_id The customer's database ID.
 * @property {Date} rental_start The start date of the rental.
 * @property {?Date} rental_end The end date of the rental.
 */

export const typeDef = gql`
  extend type Query {
    rentals: [Rental!]!
    rental(id: ID!): Rental
  }

  type Rental {
    id: ID!
    car: Car!
    customer: Customer!
    rentalStart: Date!
    rentalEnd: Date
    duration: Int!
  }
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
      const car = await db.first("*").from("cars").where({ id: parent.car_id });
      return car;
    },
    /**
     * Fetch the user that belongs to this rental object.
     * @param {Rental} parent The parent rental object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./customer").Customer[]}
     */
    customer: async (parent, _, { db }) => {
      /**
       * @type {import("./customer").Customer[]}
       */
      const customer = await db.first("*").from("customers").where({ id: parent.customer_id });
      return customer;
    },
    /**
     * Remap rental_start to rentalStart for GraphQL.
     * @param {Rental} parent The parent rental object.
     * @returns {Date}
     */
    rentalStart: (parent) => new Date(parent.rental_start),
    /**
     * Remap rental_end to rentalEnd for GraphQL.
     * @param {Rental} parent The parent rental object.
     * @returns {?Date}
     */
    rentalEnd: (parent) => new Date(parent.rental_end),
    /**
     * Calculate the number of days the rental has been running for.
     * @param {Rental} parent The parent rental object.
     */
    duration: (parent) => {
      const rentalStart = new Date(parent.rental_start);
      const rentalEnd = parent.rental_end ? new Date(parent.rental_end) : new Date();
      const diff = rentalEnd.getTime() - rentalStart.getTime();
      const diffDays = Math.ceil(diff / 1000 / 60 / 60 / 24);
      return diffDays;
    },
  },
  },
};
