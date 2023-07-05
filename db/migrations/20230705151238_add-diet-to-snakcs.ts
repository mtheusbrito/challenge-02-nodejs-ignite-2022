import { table } from "console";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('snakcs', (table)=>{
        table.boolean('diet').defaultTo(false).after('name')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('snakcs', (table) => {
        table.dropColumn('diet')
      })
}

