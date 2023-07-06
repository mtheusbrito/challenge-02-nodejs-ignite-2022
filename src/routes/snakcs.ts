import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function snakcsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", ensureAuthenticated);
  app.get(`/`, 
  {
    schema: {
      description: "List Snakcs",
      tags: ["Snakc"],
      summary: "list snakcs",
      // security: [{ "bearerAuth": [] }],
      headers:  {
          type: "object",
          properties: {
            authorization: { type: "string" },
          },
          required: ["authorization"],
        },
      response: {
        200: {type: "object",
            properties: {
              snakcs: {
                type: "array",
                items: {
                    type: 'object',
                    properties:{
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        date: { type: "string" },
                        time: { type: 'string'},
                        user_id: { type: "string" },
                        diet: { type: "boolean" },
                    }
                   
                  },
              },
            },},
        
        
      },
    },
  }
  ,async (request, reply) => {
    const { id } = request.user;

    const snakcs = await knex("snakcs")
      .where("user_id", id)
      .select()
      .orderBy("date")
      .orderBy("time");

    return { snakcs: snakcs };
  });

  app.post(
    "/",
    {
      schema: {
        description: "Create Snakc",
        tags: ["Snakc"],
        summary: "create snakc",
        // security: [{ "bearerAuth": [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            diet: { type: "boolean" },
            date: { type: "string" },
            time: { type: "string" },
            description: { type: "string" },
          },
        },
        headers:  {
            type: "object",
            properties: {
              authorization: { type: "string" },
            },
            required: ["authorization"],
          },
        response: {
          201: {},
        },
      },
    },
    async (request, reply) => {
      const { id } = request.user;
      const createSnakcBodySchema = z.object({
        name: z.string(),
        diet: z.boolean(),
        date: z.string(),
        time: z.string(),
        description: z.string(),
      });

      const { name, diet, description, date, time } =
        createSnakcBodySchema.parse(request.body);

      await knex("snakcs").insert({
        id: randomUUID(),
        name,
        description,
        diet,
        time,
        date,
        user_id: id,
      });

      return reply.status(201).send();
    }
  );

  app.delete(
    "/:id",
    {
      schema: {
        description: "Delete a Snakc",
        tags: ["Snakc"],
        summary: "delete a snakc",
        // security: [{ "bearerAuth": [] }],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "snakc id",
            },
          },
        },
        headers:  {
            type: "object",
            properties: {
              authorization: { type: "string" },
            },
            required: ["authorization"],
          },
        response: {
          200: {},
        },
      },
    },
    async (request, reply) => {
      const { id: idSnakc } = request.params as { id: String };
      const { id: userId } = request.user;

      const snakc = await knex("snakcs").where("id", idSnakc).first();

      if (!snakc) {
        return reply.status(400).send({ message: "Snakc not found." });
      }

      if (snakc.user_id !== userId) {
        return reply.status(403).send({ message: "Unauthorized." });
      }

      await knex("snakcs").delete().where("id", idSnakc);

      return reply.status(200).send();
    }
  );
  app.get("/:id",{
        schema: {
        description: "Get a Snakc",
        tags: ["Snakc"],
        summary: "get a snakc",
        // security: [{ "bearerAuth": [] }],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "snakc id",
            },
          },
        },
        headers:  {
            type: "object",
            properties: {
              authorization: { type: "string" },
            },
            required: ["authorization"],
          },

        response: {
          200: {
            type: "object",
            properties: {
              snakc: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                  time: { type: "string" },
                  date: { type: 'string'},
                  user_id: { type: "string" },
                  diet: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id: idSnakc } = request.params as { id: String };
      const { id: userId } = request.user;

      const snakc = await knex("snakcs").where("id", idSnakc).first();

      if (!snakc) {
        return reply.status(400).send({ message: "Snakc not found." });
      }

      if (snakc.user_id !== userId) {
        return reply.status(403).send({ message: "Unauthorized." });
      }

      return reply.status(200).send({ snakc: snakc });
    }
  );
  app.put("/:id", 
  {
    schema: {
      description: "Update Snakc",
      tags: ["Snakc"],
      summary: "update snakc",
      // security: [{ "bearerAuth": [] }],
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          diet: { type: "boolean" },
          date: { type: "string" },
          time: { type: "string" },
          description: { type: "string" },
        },
      },
      headers:  {
          type: "object",
          properties: {
            authorization: { type: "string" },
          },
          required: ["authorization"],
        },
      response: {
        200: {},
      },
    },
  }
  ,async (request, reply) => {
    const { id: idSnakc } = request.params as { id: String };
    const { id: userId } = request.user;

    const updateSnakcBodySchema = z.object({
      name: z.string(),
      diet: z.boolean(),
      date: z.string(),
      time: z.string(),
      description: z.string(),
    });

    const { name, diet, date, time, description } = updateSnakcBodySchema.parse(
      request.body
    );

    const snakc = await knex("snakcs").where("id", idSnakc).first();

    if (!snakc) {
      return reply.status(400).send({ message: "Snakc not found." });
    }

    if (snakc.user_id !== userId) {
      return reply.status(403).send({ message: "Unauthorized." });
    }

    await knex("snakcs")
      .update({ name, diet, date, time, description })
      .where("id", idSnakc);

    return reply.status(200).send();
  });

  app.get("/metrics", {
    schema: {
      description: "Get a Metrics",
      tags: ["Snakc"],
      summary: "get a metrics",
      // security: [{ "bearerAuth": [] }],
      headers:  {
          type: "object",
          properties: {
            authorization: { type: "string" },
          },
          required: ["authorization"],
        },

      response: {
        200: {
          type: "object",
          properties: {
            snakc: {
              type: "object",
              properties: {
                 total: { type: "number" },
                insideTheDiet: { type: "number" },
                outsideTheDiet: { type: "number" },
                bestPerformace: { type: "number" },
               
              },
            },
          },
        },
      },
    },
  },async (request, reply) => {
    const { id: userId } = request.user;

    const snakcs = await knex("snakcs")
      .where("user_id", userId)
      .select()
      .orderBy("date")
      .orderBy("time");
    const total = snakcs.length;
    const insideTheDiet = snakcs.filter((s) => s.diet).length;
    const outsideTheDiet = snakcs.filter((s) => !s.diet).length;

    let bestPerformace = 0;
    let diets = 0;

    snakcs.forEach((s) => {
      if (s.diet) {
        diets++;
        if (diets > bestPerformace) {
          bestPerformace = diets;
        }
      } else {
        diets = 0;
      }
    });
    return {
      total,
      insideTheDiet,
      outsideTheDiet,
      bestPerformace,
    };
  });
}
