const Knex = require("knex");
const bcrypt = require("bcrypt");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "Dan6erbond", password: bcrypt.hashSync("test123", 10) },
        { id: 2, username: "Doemuu", password: bcrypt.hashSync("test123", 10) },
        { id: 3, username: "Idkwhatnickshouldiuse", password: bcrypt.hashSync("test123", 10) },
      ]);
    });
};
