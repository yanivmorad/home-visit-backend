// migrations/20250708_add_legal_representative_to_children.js
exports.up = async function (knex) {
  await knex.schema.alterTable("children", (table) => {
    table.string("legal_representative").nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("children", (table) => {
    table.dropColumn("legal_representative");
  });
};
