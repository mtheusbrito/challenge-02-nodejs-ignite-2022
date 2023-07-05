import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("snakcs", (table) => {
        table.uuid("id").primary();
        table.text('name').notNullable
        table.text('description').unique().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.uuid('user_id').unsigned().index().references('id').inTable('users').onDelete('SET NULL')
      });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snakcs')
}

