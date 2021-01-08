import { gql } from "apollo-server-express";
import Knex from "knex";
import { isNil, omitBy } from "lodash";

/**
 * A customer model.
 * @typedef {Object} Customer
 * @property {number} id The customer's database ID.
 * @property {?number} user_id The customer user's database ID.
 * @property {string} first_name The customer's first name.
 * @property {string} last_name The customer's last name.
 *
 * The input object provided as GraphQL args to createCustomer.
 * @typedef {Object} CreateCustomerInput
 * @property {?number} userId The customer's associated user, if given.
 * @property {string} firstName The customer's first name.
 * @property {string} lastName The customer's last name.
 *
 * The payload returned by createCustomer.
 * @typedef {Object} CreateCustomerPayload
 * @property {?Customer} customer The newly created customer.
 * @property {?string} error Errors if any are thrown.
 *
 * The input object provided as GraphQL args to editCustomer.
 * @typedef {Object} EditCustomerInput
 * @property {string} id The customer ID to update.
 * @property {?string} userId The user to assign the customer to.
 * @property {?string} firstName The customer's first name.
 * @property {?string} lastName The customer's last name..
 *
 * The payload returned by editCustomer.
 * @typedef {Object} EditCustomerPayload
 * @property {Customer} customer The updated customer.
 * @property {?string} error Errors if any are thrown.
 */

export const typeDef = gql`
  extend type Query {
    customer(id: ID!): Customer
    customers: [Customer!]!
  }

  type Customer {
    id: ID!
    user: User
    rentals: [Rental!]!
    firstName: String!
    lastName: String!
  }

  input CreateCustomerInput {
    userId: ID
    firstName: String!
    lastName: String!
  }

  type CreateCustomerPayload {
    customer: Customer
    error: String
  }

  input EditCustomerInput {
    userId: ID
    firstName: String
    lastName: String
  }

  type EditCustomerPayload {
    customer: Customer
    error: String
  }

  extend type Mutation {
    createCustomer(input: CreateCustomerInput!): CreateCustomerPayload!
    editCustomer(input: EditCustomerInput!): EditCustomerPayload!
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
      if (!parent.user_id) {
        return;
      }
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
  Mutation: {
    /**
     * Create a customer object and return the payload.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {CreateCustomerInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {CreateCustomerPayload}
     */
    createCustomer: async (_, { input }, { db }) => {
      const { userId, firstName, lastName } = input;

      if (userId) {
        const user = await db.first("*").from("users").where({ id: userId });
        if (!user) {
          return {
            error: `The user specified by ID ${userId} does not exist.`,
          };
        }
      }

      const values = { user_id: userId, first_name: firstName, last_name: lastName };
      const [id] = await db.insert(values).into("customers");

      return {
        customer: {
          ...values,
          id,
        },
      };
    },
    /**
     * Update a customer object and return the payload.
     * @param {Object} _
     * @param {Object} args Arguments passed to the query.
     * @param {EditCustomerInput} args.input The input argument passed to the mutation.
     * @param {Object} ctx GraphQL context variables.
     * @param {Knex} ctx.db The Knex DB instance.
     * @returns {EditCarPayload}
     */
    editCustomer: async (_, { input }, { db }) => {
      const { id, firstName, lastName, userId } = input;

      /**
       * @type {Customer}
       */
      const customer = await db.first("*").from("customers").where({ id });
      if (!customer) {
        return {
          error: `The customer by ID ${id} does not exist.`,
        };
      }

      if (userId) {
        const user = await db.first("*").from("users").where({ id: userId });
        if (!user) {
          return {
            error: `The user by ID ${userId} does not exist.`,
          };
        }
      }

      let values = { first_name: firstName, last_name: lastName, user_id: userId };
      values = omitBy(values, isNil);
      await db.update(values).table("customers").where({ id });

      return {
        customer: {
          ...customer,
          ...values,
        },
      };
    },
  },
};
