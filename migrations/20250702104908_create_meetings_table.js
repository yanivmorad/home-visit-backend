exports.up = async function (knex) {
  await knex.schema.createTable("meetings", (table) => {
    table.increments("id").primary();
    table
      .integer("child_id")
      .unsigned()
      .references("id")
      .inTable("children")
      .onDelete("CASCADE");
    table.timestamp("date", { useTz: false }).notNullable();
    table.text("summary").notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("meetings");
};
