import { gql } from "apollo-server-express";
import Knex from "knex";
import { isNil, omitBy } from "lodash";
import slugify from "../../helpers/slugify";

/**
 * A car model.
 * @typedef {Object} Car
 * @property {number} id The car's database ID.
 * @property {number} make_id The car make's database ID.
 * @property {string} model The car's model name.
 * @property {string} slug The car's model name, slugified.
 * @property {number} price_per_day The price to rent the car per day.
 * @property {number} units The number of available units.
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
 *
 * The input object provided as GraphQL args to editCar.
 * @typedef {Object} EditCarInput
 * @property {string} id The car ID to update.
 * @property {?string} model The model name.
 * @property {?string} makeId The make ID to be associated with this vehicle model.
 * @property {?number} pricePerDay The price per day to rent this vehicle.
 *
 * The payload returned by editCar.
 * @typedef {Object} EditCarPayload
 * @property {Car} car The updated car.
 * @property {?string} error Errors if any are thrown.
 */

export const typeDef = gql`
  extend type Query {
    car(id: ID, slug: String): Car
    cars: [Car!]!
  }

  type Car {
    id: ID!
    model: String!
    slug: String!
    make: Make!
    pricePerDay: Float!
    rentals: [Rental!]!
    units: Int!
    availableUnits: Int!
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

  input EditCarInput {
    id: ID!
    model: String
    makeId: ID
    pricePerDay: Float
  }

  type EditCarPayload {
    car: Car
    error: String
  }

  extend type Mutation {
    createCar(input: CreateCarInput!): CreateCarPayload!
    editCar(input: EditCarInput!): EditCarPayload!
  }
`;

export const resolvers = {
  Query: {
    /**
     * Fetch a car by its ID.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {?number} args.id The car ID to query for.
     * @param {?string} args.slug The car slug to query for.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {?Car}
     */
    car: async (_, { id, slug }, { db }) => {
      let where = {};
      if (id) {
        where = { ...where, id };
      }
      if (slug) {
        where = { ...where, slug };
      }
      /**
       * @type {?Car}
       */
      const car = await db.first("*").from("cars").where(where);
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
    /**
     * Return the number of available units accounting rentals.
     * @param {Car} parent The parent car object.
     * @param {Object} args Arguments passed to the query.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {number}
     */
    availableUnits: async (parent, _, { db }) => {
      const [{ CNT: rentals }] = await db
        .count("id as CNT")
        .from("rentals")
        .where({ car_id: parent.id, rental_end: null });
      return Math.max(0, parent.units - rentals);
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
      const { makeId, pricePerDay, model } = input;

      const make = await db.first("*").from("makes").where({ id: makeId });
      if (!make) {
        return {
          error: `The make by ID ${makeId} does not exist.`,
        };
      }

      const values = { model, price_per_day: pricePerDay, make_id: makeId, slug: model && slugify(model) };
      const [id] = await db.insert(values).into("cars");

      return {
        car: {
          ...values,
          id,
        },
      };
    },
    /**
     * Update a car object and return the payload.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {EditCarInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {EditCarPayload}
     */
    editCar: async (_, { input }, { db }) => {
      const { id, makeId, pricePerDay, model } = input;

      /**
       * @type {Car}
       */
      const car = await db.first("*").from("cars").where({ id });
      if (!car) {
        return {
          error: `The car by ID ${id} does not exist.`,
        };
      }

      if (makeId) {
        const make = await db.first("*").from("makes").where({ id: makeId });
        if (!make) {
          return {
            error: `The make by ID ${makeId} does not exist.`,
          };
        }
      }

      let values = { model, price_per_day: pricePerDay, make_id: makeId, slug: model && slugify(model) };
      values = omitBy(values, isNil);
      await db.update(values).table("cars").where({ id });

      return {
        car: {
          ...car,
          ...values,
        },
      };
    },
  },
};
