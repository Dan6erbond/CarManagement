const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("customers")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("customers").insert([
        { id: 1, user_id: 1, first_name: "RaviAnand", last_name: "Mohabir" },
        { id: 2, user_id: 2, first_name: "Dominik", last_name: "Berger" },
        { id: 3, user_id: 3, first_name: "Max", last_name: "" },
      ]);
    });
};
