const Knex = require("knex");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("makes")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("makes").insert([
        { id: 1, name: "Mercedes" },
        { id: 2, name: "BMW" },
        { id: 3, name: "Audi" },
        { id: 4, name: "VW" },
        { id: 5, name: "Porsche" },
        { id: 6, name: "Toyota" },
        { id: 7, name: "Honda" },
        { id: 8, name: "Nissan" },
        { id: 9, name: "Subaru" },
        { id: 10, name: "Volvo" },
        { id: 11, name: "Jaguar" },
        { id: 12, name: "Lexus" },
        { id: 13, name: "Aston Martin" },
        { id: 14, name: "Opel" },
        { id: 15, name: "Ford" },
        { id: 16, name: "Bentley" },
        { id: 17, name: "Mitsubishi" },
        { id: 18, name: "Dodge" },
        { id: 19, name: "Chevrolet" },
        { id: 20, name: "Cadillac" },
        { id: 21, name: "Jeep" },
        { id: 22, name: "Ferrari" },
        { id: 23, name: "Lamborghini" },
        { id: 24, name: "Maserati" },
        { id: 25, name: "Renault" },
        { id: 26, name: "Peugeot" },
        { id: 27, name: "Citroën" },
        { id: 28, name: "Mazda" },
      ]);
    });
};
