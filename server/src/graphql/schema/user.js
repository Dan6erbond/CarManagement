import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A user model.
 * @typedef {Object} User
 * @property {number} id The user's database ID.
 * @property {string} username The user's site username.
 * @property {string} password The user's hashed password.
 */

export const typeDef = gql`
  extend type Query {
    users: [User!]!
    user(id: Int, username: String): User
  }

  type User {
    id: ID!
    username: String!
    customer: Customer
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
     * @return {User[]}
     */
    users: async (_, __, { db }) => {
      /**
       * @type {User[]}
       */
      const users = await db.select("*").from("users");
      return users;
    },
    /**
     *
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {number} args.id The user ID to query for.
     * @param {string} args.username The username to query by.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @return {?User}
     */
    user: async (_, { id, username }, { db }) => {
      let where = {};
      if (id) {
        where = { ...where, id };
      }
      if (username) {
        where = { ...where, username };
      }
      /**
       * @type {?User}
       */
      const user = await db.first("*").from("users").where(where);
      return user;
    },
  },
  User: {
    /**
     * Fetch the user's associated customer model.
     * @param {User} parent The user parent object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     */
    customer: async (parent, _, { db }) => {
      /**
       * @type {import("./customer").Customer}
       */
      const customer = db.first("*").from("customers").where({ user_id: parent.id });
      return customer;
    },
  },
};
