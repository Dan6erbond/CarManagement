const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("customers", (table) => {
      table.dropColumn("user_id");
    })
    .alterTable("customers", (table) => {
      table.integer("user_id").unsigned();

      table.foreign("user_id").references("id").inTable("users");
    });
};

/**
 * Undo changes made by this migration.
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("customers", (table) => {
      table.dropColumn("user_id");
    })
    .alterTable("customers", (table) => {
      table.string("user_id").unsigned();

      table.foreign("user_id").references("id").inTable("users");
    });
};
