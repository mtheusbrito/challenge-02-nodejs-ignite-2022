import { FastifyInstance } from "fastify";
import { z } from "zod";
import passwordUtils from "../utils/password-utils";
import { knex } from "../database";
import auth from "../config/auth";
import { sign } from "jsonwebtoken";


const {expires_in_token, secret_token } = auth
export async function accountRoutes(app: FastifyInstance) {

    
    app.post('/login', {
        schema: {
          description: "Login user",
          tags: ["Auth"],
          summary: "authenticate user",
  
          body: {
            type: "object",
            properties: {
              username: { type: "string" },
              password: { type: "string" },
            },
          },
          response: {
            200: {
                type: 'object',
                properties: {
                    accessToken: { type: 'string' }
                }
            },
          },
        },
      }, async (request, response) => {
        const createLoginBodySchema = z.object({
            username: z.string(),
            password: z.string(),
        }) 
        
        const { username, password } = createLoginBodySchema.parse(request.body);

        const userDb = await knex('users').where('username', username).first()

        if(!userDb || !passwordUtils.passwordIsMatch(userDb.password, password)){
            return response.status(400).send({message: 'Username or password incorrect'})
        }

        const token = sign({}, secret_token, {
            subject: userDb.id,
            expiresIn: expires_in_token
        })


        return {
            accessToken: token
        }
    })
}