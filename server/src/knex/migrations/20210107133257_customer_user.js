const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("customers", (table) => {
      table.dropForeign("user_id");
      table.dropColumn("user_id");
    })
    .alterTable("customers", (table) => {
      table.string("user_id").unsigned();
    });
};

/**
 * Undo changes made by this migration.
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("customers", (table) => {
      table.dropForeign("user_id");
      table.dropColumn("user_id");
    })
    .alterTable("customers", (table) => {
      table.string("user_id").unsigned().notNullable();
    });
};
