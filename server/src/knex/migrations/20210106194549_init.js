const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 255).unique().notNullable();
      table.string("password", 255).notNullable();
    })
    .createTable("customers", (table) => {
      table.increments("id").primary();
      table.string("user_id").unsigned().notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();

      table.foreign("user_id").references("id").inTable("users");
    })
    .createTable("makes", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
    })
    .createTable("cars", (table) => {
      table.increments("id").primary();
      table.integer("make_id").unsigned().notNullable();
      table.string("model").notNullable();
      table.double("price_per_day").notNullable();

      table.foreign("make_id").references("id").inTable("makes");
    })
    .createTable("rentals", (table) => {
      table.increments("id").primary();
      table.integer("car_id").unsigned().notNullable();
      table.integer("customer_id").unsigned().notNullable();
      table.date("rental_start").notNullable();
      table.date("rental_end");

      table.foreign("car_id").references("id").inTable("cars");
      table.foreign("customer_id").references("id").inTable("customers");
    });
};

/**
 * Undo changes made by this migration.
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("customers")
    .dropTable("makes")
    .dropTable("cars")
    .dropTable("rentals");
};
