import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * Car model's make.
 * @typedef {Object} Make
 * @property {number} id The make's database ID.
 * @property {string} name The make's name.
 */

export const typeDef = gql`
  extend type Query {
    makes: [Make!]!
  }

  type Make {
    id: ID!
    name: String!
    cars: [Car!]!
  }
`;

export const resolvers = {
  Query: {
    /**
     *
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
  },
  Make: {
    /**
     *
     * @param {Make} parent The parent make object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./car").Car[]}
     */
    cars: async (parent, _, { db }) => {
      const cars = await db.select("*").from("cars").where({ make_id: parent.id });
      return cars;
    },
  },
};
