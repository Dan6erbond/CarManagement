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
 *
 * The input object provided as GraphQL args to rentCar.
 * @typedef {Object} RentCarInput
 * @property {string} carId The car ID to rent.
 * @property {string} customerId The customer ID who's renting.
 *
 * The payload returned by rentCar.
 * @typedef {Object} RentCarPayload
 * @property {?Rental} rental The rental information.
 * @property {?string} error Errors if any are thrown.
 *
 * The input object provided as GraphQL args to returnCar.
 * @typedef {Object} ReturnCarInput
 * @property {string} rentalId The rental ID to end.
 *
 * The payload returned by returnCar.
 * @typedef {Object} ReturnCarPayload
 * @property {?Rental} rental The rental information.
 * @property {?string} error Errors if any are thrown.
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
    cost: Int!
  }

  input RentCarInput {
    carId: ID!
    customerId: ID!
  }

  type RentCarPayload {
    rental: Rental
    error: String
  }

  input ReturnCarInput {
    rentalId: ID!
  }

  type ReturnCarPayload {
    rental: Rental
    error: String
  }

  extend type Mutation {
    rentCar(input: RentCarInput!): RentCarPayload!
    returnCar(input: ReturnCarInput!): ReturnCarPayload!
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
    rentalEnd: (parent) => parent.rental_end && new Date(parent.rental_end),
    /**
     * Calculate the number of days the rental has been running for.
     * @param {Rental} parent The parent rental object.
     * @returns {number}
     */
    duration: (parent) => {
      const rentalStart = new Date(parent.rental_start);
      const rentalEnd = parent.rental_end ? new Date(parent.rental_end) : new Date();
      const diff = rentalEnd.getTime() - rentalStart.getTime();
      const diffDays = Math.ceil(diff / 1000 / 60 / 60 / 24);
      return diffDays;
    },
    /**
     * Return the amount owed for this rental.
     * @param {Rental} parent The parent rental object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {number}
     */
    cost: async (parent, _, { db }) => {
      const rentalStart = new Date(parent.rental_start);
      const rentalEnd = parent.rental_end ? new Date(parent.rental_end) : new Date();
      const diff = rentalEnd.getTime() - rentalStart.getTime();
      const diffDays = Math.ceil(diff / 1000 / 60 / 60 / 24);

      /**
       * @type {import("./car").Car}
       */
      const car = await db.first("*").from("cars").where({ id: parent.car_id });

      return car.price_per_day * diffDays;
    },
  },
  Mutation: {
    /**
     * Rent a car object to the specified customer.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {RentCarInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {RentCarPayload}
     */
    rentCar: async (_, { input }, { db }) => {
      const { carId, customerId } = input;

      /**
       * @type {import("./car").Car}
       */
      const car = await db.first("*").from("cars").where({ id: carId });
      if (!car) {
        return {
          error: `The car by ID ${carId} does not exist.`,
        };
      }

      const [{ CNT: rentals }] = await db.count("id as CNT").from("rentals").where({ car_id: carId, rental_end: null });
      if (rentals >= car.units) {
        return {
          error: `All units of the car by ID ${carId} are already rented out.`,
        };
      }

      /**
       * @type {import("./customer").Customer}
       */
      const customer = await db.first("*").from("customers").where({ id: customerId });
      if (!customer) {
        return {
          error: `The customer by ID ${customerId} does not exist.`,
        };
      }

      const values = { rental_start: Date.now(), customer_id: customerId, car_id: carId };
      const [id] = await db.insert(values).into("rentals");

      return {
        rental: {
          id,
          ...values,
        },
      };
    },
    /**
     * Return a car, the rental must exist.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {ReturnCarInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {ReturnCarPayload}
     */
    returnCar: async (_, { input }, { db }) => {
      const { rentalId } = input;

      /**
       * @type {Rental}
       */
      const rental = await db.first("*").from("rentals").where({ id: rentalId });
      if (!rental) {
        return {
          error: `The rental by ID ${rentalId} does not exist`,
        };
      } else if (rental.rental_end) {
        return {
          error: `The car for rental by ID ${rentalId} has already been returned.`,
        };
      }

      const values = { rental_end: Date.now() };
      await db.update(values).table("rentals").where({ id: rentalId });

      return {
        rental: {
          ...rental,
          ...values,
        },
      };
    },
  },
};
