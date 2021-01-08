const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("rentals")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("rentals").insert([
        { id: 1, car_id: 53, customer_id: 1, rental_start: new Date().getTime() },
        { id: 2, car_id: 48, customer_id: 3, rental_start: new Date().getTime() },
        { id: 3, car_id: 22, customer_id: 4, rental_start: new Date().getTime() },
      ]);
    });
};
