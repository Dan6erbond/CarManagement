// Update with your config settings.
const Knex = require("knex");
var path = require("path");

/**
 * @type {Knex.Config<any>}
 */
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "..", "..", "tmp", "db.sqlite"),
    },
    useNullAsDefault: true,
    migrations: {
      stub: "migration.stub",
    },
  },
};
