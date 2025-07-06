// src/db.js
const pg = require("pg");
const types = pg.types;

// טיפוס 1082 הוא DATE ב־PostgreSQL
types.setTypeParser(1082, (val) => val); // מחזיר תאריך כמחרוזת "YYYY-MM-DD"

const env = process.env.NODE_ENV || "development";
const config = require("../knexfile")[env];

const knex = require("knex")(config);
module.exports = knex;
