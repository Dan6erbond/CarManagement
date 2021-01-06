import { gql } from "apollo-server-express";
import Knex from "knex";

/**
 * A customer model.
 * @typedef {Object} Customer
 * @property {number} id The customer's database ID.
 * @property {number} user_id The customer user's database ID.
 * @property {string} first_name The customer's first name.
 * @property {string} last_name The customer's last name.
 */

export const typeDef = gql`
  extend type Query {
    customer(id: ID!): Customer
    customers: [Customer!]!
  }

  type Customer {
    id: ID!
    user: User!
    rentals: [Rental!]!
    firstName: String!
    lastName: String!
  }
`;

export const resolvers = {
  Query: {
    /**
     * Retrieve a customer by its ID.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {number} args.id The customer ID to query for.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {Customer}
     */
    customer: async (_, { id }, { db }) => {
      const customer = await db.first("*").from("customers").where({ id });
      return customer;
    },
    /**
     * Fetch all the database customers.
     * @param {Object} _
     * @param {Object} __
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {Customer[]}
     */
    customers: async (_, __, { db }) => {
      /**
       * @type {Customer[]}
       */
      const customers = await db.select("*").from("customers");
      return customers;
    },
  },
  Customer: {
    /**
     * Remap the customer's first_name property to firstName for GraphQL.
     * @param {Customer} parent The parent customer object.
     */
    firstName: (parent) => parent.first_name,
    /**
     * Remap the customer's last_name property to lastName for GraphQL.
     * @param {Customer} parent The parent customer object.
     */
    lastName: (parent) => parent.last_name,
    /**
     * Fetch the customer's user model.
     * @param {Customer} parent The parent customer object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./user").User}
     */
    user: async (parent, _, { db }) => {
      /**
       * @type {import("./user").User}
       */
      const user = await db.first("*").from("users").where({ id: parent.user_id });
      return user;
    },
    /**
     * Fetch the customer's rentals.
     * @param {Customer} parent The parent customer object.
     * @param {Object} _
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {import("./rental").Rental}
     */
    rentals: async (parent, _, { db }) => {
      /**
       * @type {import("./rental").Rental}
       */
      const rentals = await db.select("*").from("rentals").where({ customer_id: parent.id });
      return rentals;
    },
  },
};
