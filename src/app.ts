import fastify from 'fastify'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.get(`/`, async ()=>{

 return {message: 'It`s works!'}
})