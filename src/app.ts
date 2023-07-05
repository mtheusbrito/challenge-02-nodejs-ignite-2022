import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { accountRoutes } from './routes/account'

export const app = fastify()

app.register(cookie)

app.get(`/`, async ()=>{

 return {message: 'It`s works!'}
})
app.register(usersRoutes, {prefix: 'users'})
app.register(accountRoutes, {prefix: 'account'})