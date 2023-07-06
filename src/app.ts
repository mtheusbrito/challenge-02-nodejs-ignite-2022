import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { accountRoutes } from './routes/account'
import { snakcsRoutes } from './routes/snakcs'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export const app = fastify()

app.register(cookie)
app.register(fastifySwagger, {

    swagger: {
        
        info: {
          title: "Daily Diet API",
          description: "NODE API REST - Daily Diet",
          version: "0.1.0",
          
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Find more info here",
        },
      },
});
app
  .register(fastifySwaggerUi, {

    routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
    
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true,
  

})





app.get(`/`, async ()=>{

 return {message: 'It`s works!'}
})



app.register(usersRoutes, {prefix: 'users'})
app.register(accountRoutes, {prefix: 'account'})
app.register(snakcsRoutes, { prefix: 'snakcs'})


