import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function balao(app: FastifyInstance) {

    app.post('/addbalao', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            title: z.string(),
            subtitle: z.string(),
            amountSlice: z.number(),
            limitUse: z.number(),
            primaryColor: z.string(),
            secondaryColor: z.string(),
            bgColor: z.string(),
            premios: z.string(),
        })
        const { name, title, subtitle, amountSlice, limitUse, primaryColor, secondaryColor, bgColor, premios } = bodySchema.parse(req.body)
        console.log(req.body)

        try {
            await prisma.balao.create({
                data: {
                    name,
                    title,
                    subtitle,
                    amountSlice,
                    limitUse,
                    primaryColor,
                    secondaryColor,
                    bgColor,
                    premios,
                }
            })
            res.status(200).send({ message: 'Balao Criado Com Sucesso', data: true })
            console.log('Balao Criado Com Sucesso')

        } catch (error) {
            res.status(500).send({ message: 'Erro ao criar balao', data: false })
        }
    })



    app.post('/addbalaopremio', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            premios: z.string(),
        })
        const { name, premios } = bodySchema.parse(req.body)

        try {
            const dataBalao = await prisma.balao.findFirst({
                where: {
                    name,
                }
            })

            await prisma.balao.update({
                where: {
                    id: dataBalao?.id,
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



    app.post('/findbalao', async (req, res) => {

        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)
        console.log(req.body)

        const clientIP = req.ip; // Captura o IP do cliente
        console.log(`IP do cliente: ${clientIP}`);

        try {
            const balaos = await prisma.balao.findFirst({
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


            if (balaos && (!ipClient || ipClient.played < balaos.limitUse)) {

                res.status(200).send({ message: 'Balao encontrado', data: balaos })
                console.log('Balao encontrado')
            } else {
                res.status(200).send({ message: 'Tentativas esgotadas!', data: false })
            }

        } catch (error) {
            res.status(500).send({ message: 'Balao não encontrado', data: false })
        }
    })



    app.delete('/deletebalao', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        try {
            const balaos = await prisma.balao.findFirst({
                where: {
                    name,
                }
            })

            if (balaos) {
                await prisma.balao.delete({
                    where: {
                        id: balaos.id,
                    }
                })
                res.status(200).send({ message: 'Balão Deletado Com Sucesso', data: true })
                console.log('Balão Deletado Com Sucesso')
            } else {
                res.status(500).send({ message: 'Erro ao deletar balão', data: false })
            }

        } catch (error) {
            res.status(500).send({ message: 'Balão não encontrado', data: false })
        }
    })

}