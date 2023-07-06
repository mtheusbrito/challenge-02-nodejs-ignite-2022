import { z } from "zod";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { knex } from "../database";
import passwordUtils from "../utils/password-utils";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    `/`,
    {
      schema: {
        description: "Create User",
        tags: ["User"],
        summary: "create user",

        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
            201: {
            
            },
        },
      },
    },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
      });

      const { name, username, password } = createUserBodySchema.parse(
        request.body
      );

      const passwordEncripted = passwordUtils.encrypt(password);

      await knex("users").insert({
        id: randomUUID(),
        name,
        username,
        password: passwordEncripted,
      });

      return reply.status(201).send();
    }
  );
}
