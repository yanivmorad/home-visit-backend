exports.up = async function (knex) {
  await knex.schema.createTable("children", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable(); // רק זה חובה
    table.string("area").nullable(); // כל שאר השדות – אופציונליים
    table.string("city").nullable();
    table.string("address").nullable();
    table.jsonb("phone_numbers").defaultTo("[]"); // ברירת מחדל למערך ריק
    table.date("birth_date").nullable();
    table.string("id_number").nullable();
    table.date("last_visit").nullable(); // הוספנו DATE במקום TIMESTAMP
    table.string("category").nullable(); // השדה החדש
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("children");
};
