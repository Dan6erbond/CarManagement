const Knex = require("knex");
const slugify = require("../../helpers/slugify");

/**
 * Run the migration and perform the operations.
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("cars")
    .del()
    .then(function () {
      let values = [
        { id: 1, make_id: 1, model: "E250 CDI", price_per_day: 100, units: Math.ceil(Math.random() * 15) },
        { id: 2, make_id: 1, model: "SLS AMG GT", price_per_day: 300, units: Math.ceil(Math.random() * 15) },
        { id: 3, make_id: 1, model: "G63 AMG", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 4, make_id: 3, model: "A4", price_per_day: 80, units: Math.ceil(Math.random() * 15) },
        { id: 5, make_id: 3, model: "A4 Avant", price_per_day: 70, units: Math.ceil(Math.random() * 15) },
        { id: 6, make_id: 3, model: "A5 Coupé", price_per_day: 100, units: Math.ceil(Math.random() * 15) },
        { id: 7, make_id: 3, model: "A5 Sportback", price_per_day: 100, units: Math.ceil(Math.random() * 15) },
        { id: 8, make_id: 3, model: "A5 Avant", price_per_day: 90, units: Math.ceil(Math.random() * 15) },
        { id: 9, make_id: 3, model: "A5 Cabrio", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 10, make_id: 3, model: "A6", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 11, make_id: 3, model: "A7", price_per_day: 180, units: Math.ceil(Math.random() * 15) },
        { id: 12, make_id: 3, model: "A7 Sportback", price_per_day: 200, units: Math.ceil(Math.random() * 15) },
        { id: 13, make_id: 3, model: "Q3", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 14, make_id: 3, model: "Q5", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 15, make_id: 3, model: "Q7", price_per_day: 190, units: Math.ceil(Math.random() * 15) },
        { id: 16, make_id: 3, model: "RS4", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 17, make_id: 3, model: "RS5", price_per_day: 180, units: Math.ceil(Math.random() * 15) },
        { id: 18, make_id: 3, model: "RS7", price_per_day: 220, units: Math.ceil(Math.random() * 15) },
        { id: 19, make_id: 6, model: "Supra", price_per_day: 400, units: Math.ceil(Math.random() * 15) },
        { id: 20, make_id: 6, model: "Landcruiser", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 21, make_id: 6, model: "Celica", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 22, make_id: 7, model: "Civic", price_per_day: 60, units: Math.ceil(Math.random() * 15) },
        { id: 23, make_id: 7, model: "NSX", price_per_day: 350, units: Math.ceil(Math.random() * 15) },
        { id: 24, make_id: 7, model: "CRX", price_per_day: 60, units: Math.ceil(Math.random() * 15) },
        { id: 25, make_id: 8, model: "GT-R R34", price_per_day: 300, units: Math.ceil(Math.random() * 15) },
        { id: 26, make_id: 8, model: "GT-R R35", price_per_day: 400, units: Math.ceil(Math.random() * 15) },
        { id: 27, make_id: 8, model: "350z", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 28, make_id: 9, model: "Impreza", price_per_day: 70, units: Math.ceil(Math.random() * 15) },
        { id: 29, make_id: 9, model: "Forester", price_per_day: 80, units: Math.ceil(Math.random() * 15) },
        { id: 30, make_id: 9, model: "Legacy", price_per_day: 110, units: Math.ceil(Math.random() * 15) },
        { id: 31, make_id: 12, model: "LFA", price_per_day: 450, units: Math.ceil(Math.random() * 15) },
        { id: 32, make_id: 12, model: "IS 220d", price_per_day: 100, units: Math.ceil(Math.random() * 15) },
        { id: 33, make_id: 12, model: "HS 250h", price_per_day: 130, units: Math.ceil(Math.random() * 15) },
        { id: 34, make_id: 12, model: "LS 430", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 35, make_id: 12, model: "LC 500", price_per_day: 140, units: Math.ceil(Math.random() * 15) },
        { id: 36, make_id: 12, model: "GS 430", price_per_day: 100, units: Math.ceil(Math.random() * 15) },
        { id: 37, make_id: 12, model: "SC 430", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 38, make_id: 12, model: "RC 200t", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 39, make_id: 15, model: "Mustang", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
        { id: 40, make_id: 15, model: "Focus", price_per_day: 90, units: Math.ceil(Math.random() * 15) },
        { id: 41, make_id: 15, model: "Escort", price_per_day: 70, units: Math.ceil(Math.random() * 15) },
        { id: 42, make_id: 15, model: "GT", price_per_day: 450, units: Math.ceil(Math.random() * 15) },
        { id: 43, make_id: 15, model: "GT40", price_per_day: 600, units: Math.ceil(Math.random() * 15) },
        { id: 44, make_id: 17, model: "Lancer Evo", price_per_day: 90, units: Math.ceil(Math.random() * 15) },
        { id: 45, make_id: 17, model: "Eclipse", price_per_day: 90, units: Math.ceil(Math.random() * 15) },
        { id: 46, make_id: 17, model: "2000GT", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
        { id: 47, make_id: 18, model: "Challenger", price_per_day: 220, units: Math.ceil(Math.random() * 15) },
        { id: 48, make_id: 18, model: "Challenger Hellcat", price_per_day: 250, units: Math.ceil(Math.random() * 15) },
        { id: 49, make_id: 18, model: "Charger", price_per_day: 160, units: Math.ceil(Math.random() * 15) },
        { id: 50, make_id: 18, model: "Charger Hellcat", price_per_day: 200, units: Math.ceil(Math.random() * 15) },
        { id: 51, make_id: 18, model: "RAM", price_per_day: 120, units: Math.ceil(Math.random() * 15) },
        { id: 52, make_id: 19, model: "Camaro", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
        { id: 53, make_id: 19, model: "Camaro ZL1", price_per_day: 220, units: Math.ceil(Math.random() * 15) },
        { id: 54, make_id: 19, model: "Corvette C7", price_per_day: 270, units: Math.ceil(Math.random() * 15) },
        { id: 55, make_id: 19, model: "Corvette C8", price_per_day: 280, units: Math.ceil(Math.random() * 15) },
        {
          id: 56,
          make_id: 19,
          model: "Corvette C8 Stingray",
          price_per_day: 300,
          units: Math.ceil(Math.random() * 15),
        },
        { id: 57, make_id: 21, model: "Seep", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
        { id: 58, make_id: 21, model: "Wrangler", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 59, make_id: 21, model: "Grand Cherokee", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
        { id: 60, make_id: 22, model: "LaFerrari", price_per_day: 550, units: Math.ceil(Math.random() * 15) },
        { id: 61, make_id: 22, model: "California", price_per_day: 360, units: Math.ceil(Math.random() * 15) },
        { id: 62, make_id: 22, model: "Daytona", price_per_day: 600, units: Math.ceil(Math.random() * 15) },
        { id: 63, make_id: 22, model: "FXX", price_per_day: 600, units: Math.ceil(Math.random() * 15) },
        { id: 64, make_id: 23, model: "Countach", price_per_day: 600, units: Math.ceil(Math.random() * 15) },
        { id: 65, make_id: 23, model: "Urus", price_per_day: 330, units: Math.ceil(Math.random() * 15) },
        { id: 66, make_id: 23, model: "Aventador", price_per_day: 420, units: Math.ceil(Math.random() * 15) },
        { id: 67, make_id: 23, model: "Huràcan", price_per_day: 370, units: Math.ceil(Math.random() * 15) },
        { id: 68, make_id: 23, model: "Gaillardo", price_per_day: 260, units: Math.ceil(Math.random() * 15) },
        { id: 69, make_id: 25, model: "Clio", price_per_day: 60, units: Math.ceil(Math.random() * 15) },
        { id: 70, make_id: 25, model: "2CV", price_per_day: 60, units: Math.ceil(Math.random() * 15) },
        { id: 71, make_id: 26, model: "406", price_per_day: 70, units: Math.ceil(Math.random() * 15) },
        { id: 72, make_id: 26, model: "508", price_per_day: 80, units: Math.ceil(Math.random() * 15) },
        { id: 73, make_id: 28, model: "RX7", price_per_day: 150, units: Math.ceil(Math.random() * 15) },
        { id: 74, make_id: 28, model: "MX5", price_per_day: 110, units: Math.ceil(Math.random() * 15) },
        { id: 75, make_id: 28, model: "RX8", price_per_day: 170, units: Math.ceil(Math.random() * 15) },
      ];
      values = values.map((car) => ({ ...car, slug: slugify(car.model) }));
      // Inserts seed entries
      return knex("cars").insert(values);
    });
};
