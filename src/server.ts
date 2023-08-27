import fastify from 'fastify';
import cors from '@fastify/cors'
import { login } from './routes/login';
import { premios } from './routes/premios';
import { roulette } from './routes/roulette';
import { balao } from './routes/balao';
import { ips } from './routes/ips';
import { winner } from './routes/winner';
import { util } from './routes/utils';



const app = fastify()

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});


app.register(login)
app.register(premios)
app.register(roulette)
app.register(balao)
app.register(ips)
app.register(winner)
app.register(util)



app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log('🚒 Server is running')
})