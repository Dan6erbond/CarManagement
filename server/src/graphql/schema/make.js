import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * Car model's make.
 * @typedef {Object} Make
 * @property {number} id The make's database ID.
 * @property {string} name The make's name.
 * @property {string} slug The make's name, slugified.
 */

export const typeDef = gql`
  extend type Query {
    makes: [Make!]!
    make(id: ID, name: String): Make
  }

  type Make {
    id: ID!
    name: String!
    slug: String!
    cars: [Car!]!
  }
`;

export const resolvers = {
  Query: {
    /**
     * Fetch all the makes in the database.
     * @param {Object} _
     * @param {Object} __
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {Make[]}
     */
    makes: async (_, __, { db }) => {
      /**
       * @type {Make[]}
       */
      const makes = await db.select("*").from("makes");
      return makes;
    },
    /**
     * Fetch a make by ID or name.
     * @param {Object} _
     * @param {Object} args GraphQL query arguments.
     * @param {string} args.id The ID to retrieve a make by.
     * @param {string} args.name The name to retrieve a make by.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {?Make}
     */
    make: async (_, { id, name }, { db }) => {
      let where = {};
      if (id) {
        where = { ...where, id };
      }
      if (name) {
        where = { ...where, name };
      }
      /**
       * @type {(?Make)}
       */
      const make = await db.first("*").from("makes").where(where);
      return make;
    },
  },
  Make: {
    /**
     * Fetch all the cars built by the make.
     * @param {Make} parent The parent make object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./car").Car[]}
     */
    cars: async (parent, _, { db }) => {
      /**
       * @type {import("./car").Car[]}
       */
      const cars = await db.select("*").from("cars").where({ make_id: parent.id });
      return cars;
    },
  },
};
