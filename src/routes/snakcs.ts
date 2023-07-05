import { FastifyInstance } from "fastify";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function snakcsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", ensureAuthenticated);
  app.get(`/`, async (request, reply) => {
    const { id } = request.user;

    const snakcs = await knex("snakcs").where("user_id", id).select();

    return { snakcs: snakcs };
  });

  app.post("/", async (request, reply) => {
    const { id } = request.user;
    const createSnakcBodySchema = z.object({
      name: z.string(),
      diet: z.boolean(),
      description: z.string(),
    });

    const { name, diet, description } = createSnakcBodySchema.parse(request.body);

    await knex('snakcs').insert({
        id: randomUUID(),
        name,
        description,
        diet,
        user_id: id
    })

    return reply.status(201).send();
  });

  app.delete('/:id',async(request, reply)=> {
    const { id : idSnakc} = request.params as { id : String};
    const { id : userId} = request.user;

    const snakc = await knex('snakcs').where('id', idSnakc).first()
    
    if(!snakc){
        return reply.status(400).send({message: 'Snakc not found.'});
    }

    if (snakc.user_id !== userId){
    
        return reply.status(403).send({message: 'Unauthorized.'})
    }

    await knex('snakcs').delete().where('id', idSnakc);

    return reply.status(200).send()

})
}
