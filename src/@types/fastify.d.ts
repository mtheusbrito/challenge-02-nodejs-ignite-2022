import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    user:{
      id: string
    }
  }
}