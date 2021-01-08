const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("cars", (table) => {
    table.integer("units").notNullable().defaultTo(0);
  });
};

/**
 * Undo changes made by this migration.
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable("cars", (table) => {
    table.dropColumn("units");
  });
};
