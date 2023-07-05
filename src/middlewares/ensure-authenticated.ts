import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import auth from "../config/auth";
const { secret_token } = auth;

type IPayload = {
    sub: string;
  };
 export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply){

    const authHeader = request.headers.authorization;

    if(!authHeader){
        return reply.status(401).send({message: 'Token missing.'})
    }
  
    const [, token] = authHeader.split(' ');
    try{
        const { sub: user_id } = verify(token,secret_token ) as IPayload
        
        request.user = { 
            id: user_id
        }

    }catch(err){
        console.log(err)
        return reply.status(401).send({ message: 'Invalid token.'});
    }

}