import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function roulette(app: FastifyInstance) {

    app.post('/addroulette', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            title: z.string(),
            subtitle: z.string(),
            amountSlice: z.number(),
            limitUse: z.number(),
            primaryColor: z.string(),
            secondaryColor: z.string(),
            bgColor: z.string(),
            textColor: z.string(),
            premios: z.string(),
        })
        const { name, title, subtitle, amountSlice, limitUse, primaryColor, secondaryColor, bgColor, textColor, premios } = bodySchema.parse(req.body)
        console.log(req.body)

        try {
            console.log('Criando roleta')
            await prisma.rolette.create({
                data: {
                    name,
                    title,
                    subtitle,
                    amountSlice,
                    limitUse,
                    primaryColor,
                    secondaryColor,
                    bgColor,
                    textColor,
                    premios,
                }
            })
            res.status(200).send({ message: 'Roleta Criada Com Sucesso', data: true })
            console.log('Roleta Criada Com Sucesso')

        } catch (error) {
            res.status(500).send({ message: 'Erro ao criar roleta', data: false })
        }
    })

    app.post('/addroulettepremio', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            premios: z.string(),
        })
        const { name, premios } = bodySchema.parse(req.body)

        try {
            const dataRoulette = await prisma.rolette.findFirst({
                where: {
                    name,
                }
            })

            await prisma.rolette.update({
                where: {
                    id: dataRoulette?.id,
                },
                data: {
                    premios: premios,
                }
            })
            res.status(200).send({ message: 'Premios adicionados', data: true })
            console.log('Premios adicionados')

        } catch (error) {
            res.status(500).send({ message: 'Erro ao adicionar premios', data: false })
        }
    })


    app.post('/findroulette', async (req, res) => {

        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)
        console.log(req.body)

        const clientIP = req.ip; // Captura o IP do cliente
        console.log(`IP do cliente: ${clientIP}`);

        try {
            const roleta = await prisma.rolette.findFirst({
                where: {
                    name,
                }
            })

            const ipClient = await prisma.ips.findFirst({
                where: {
                    ip: clientIP,
                    name: name,
                }
            })

            if (!ipClient) {
                await prisma.ips.create({
                    data: {
                        ip: clientIP,
                        name: name,
                        played: 0,
                    }
                })
            }

            if (roleta && (!ipClient || ipClient.played < roleta.limitUse)) {
                res.status(200).send({ message: 'Roleta encontrada', data: roleta })
                console.log('Roleta encontrada')
            } else {
                res.status(500).send({ message: 'Erro ao encontrar roleta', data: false })
            }

        } catch (error) {
            res.status(500).send({ message: 'Roleta não encontrada', data: false })
        }
    })


    app.delete('/deleteroulette', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        try {
            const roleta = await prisma.rolette.findFirst({
                where: {
                    name,
                }
            })

            if (roleta) {
                await prisma.rolette.delete({
                    where: {
                        id: roleta.id,
                    }
                })
                res.status(200).send({ message: 'Roleta Deletada Com Sucesso', data: true })
                console.log('Roleta Deletada Com Sucesso')
            } else {
                res.status(500).send({ message: 'Erro ao deletar roleta', data: false })
            }

        } catch (error) {
            res.status(500).send({ message: 'Roleta não encontrada', data: false })
        }
    })

}