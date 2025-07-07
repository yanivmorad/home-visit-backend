// migrations/YYYYYYYYYYYY_create_meetings_table.js

exports.up = function (knex) {
  return knex.schema.createTable("meetings", (table) => {
    table.increments("id").primary();

    table
      .integer("child_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("children")
      .onDelete("CASCADE");

    table.date("date").notNullable();
    table.text("summary").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("meetings");
};
