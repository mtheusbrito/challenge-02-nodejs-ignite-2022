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
}
