exports.up = async function (knex) {
  await knex.schema.createTable("children", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("area").notNullable();
    table.string("city").notNullable();
    table.string("address").notNullable();
    table.jsonb("phone_numbers").defaultTo("[]"); // מערך של מספרי טלפון
    table.date("birth_date").nullable(); // תאריך לידה
    table.string("id_number").nullable(); // תעודת
    table.integer("frequency_days").notNullable().defaultTo(0);
    table.timestamp("last_visit", { useTz: false }).nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("children");
};
