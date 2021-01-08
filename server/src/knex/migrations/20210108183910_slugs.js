const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("cars", (table) => {
      table.string("slug").notNullable().defaultTo("");
    })
    .alterTable("makes", (table) => {
      table.string("slug").notNullable().defaultTo("");
    });
};

/**
 * Undo changes made by this migration.
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("cars", (table) => {
      table.dropColumn("slug");
    })
    .alterTable("makes", (table) => {
      table.dropColumn("slug");
    });
};
