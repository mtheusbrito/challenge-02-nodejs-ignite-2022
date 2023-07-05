import { Knex } from "knex";
// id
// name
// description
// data and hour
// diet t/f
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.text('name').notNullable
    table.text('username').unique().notNullable();
    table.text('password').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}
