import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function winner(app: FastifyInstance) {
    app.post('/winner', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            code: z.string(),
            time: z.string(),
        })
        const { name, code, time } = bodySchema.parse(req.body)

        try {
            const data = await prisma.winner.create({
                data: {
                    pName: name,
                    hash: code,
                    date: time,
                }
            }).then((data) => {
                res.status(200).send({ message: 'Ganhador registrado com sucesso!', data: true })
            })
        } catch (error) {
            res.status(200).send({ message: 'Erro ao registrar ganhador!', data: false })
        }

    })

    app.post('/getwinner', async (req, res) => {
        const bodySchema = z.object({
            hash: z.string(),
        })
        const { hash } = bodySchema.parse(req.body)

        try {
            const data = await prisma.winner.findFirst({
                where: {
                    hash: hash,
                }
            }).then((data) => {
                res.status(200).send({ message: 'Ganhador encontrado!', data: data })
            })
        } catch (error) {
            res.status(500).send({ message: 'Erro ao encontrar ganhador!', data: false })
        }
    })
}