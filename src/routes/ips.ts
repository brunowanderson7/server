import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function ips(app: FastifyInstance) {

    app.post('/updateip', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            typ: z.number(),
        })
        const { name, typ } = bodySchema.parse(req.body)
        const ip = req.ip; // Captura o IP do cliente
        console.log(`IP do cliente: ${ip}`);

        if (typ) {
            var limit = await prisma.balao.findFirst({
                where: {
                    name: name,
                },
                select: {
                    limitUse: true,
                }
            })
        } else {
            var limit = await prisma.rolette.findFirst({
                where: {
                    name: name,
                },
                select: {
                    limitUse: true,
                }
            })
        }

        try {

            const dataIp = await prisma.ips.findFirst({
                where: {
                    ip: ip,
                    name: name,
                }
            }).then(async (dataIp) => {
                if (dataIp?.played && limit?.limitUse) {
                    const nplayed = dataIp?.played + 1
                    console.log(nplayed)
                    console.log(limit?.limitUse)
                    await prisma.ips.update({
                        where: {
                            id: dataIp?.id,
                        },
                        data: {
                            played: nplayed,
                        }
                    })
                    if (nplayed >= limit?.limitUse) {
                        res.status(200).send({ message: 'Tentativas esgotadas!', data: false })
                        console.log('Tentativas esgotadas!')
                    } else {
                        console.log('Tentativas não esgotadas!')
                        res.status(200).send({ message: 'Ip Atualizado Com Sucesso', data: true })
                    }

                } else {
                    await prisma.ips.update({
                        where: {
                            id: dataIp?.id,
                        },
                        data: {
                            played: 1,
                        }
                    })
                    console.log('Tentativas n 1!')
                    res.status(200).send({ message: 'Ip Atualizado Com Sucesso', data: true })
                }
            })

        } catch (error) {
            res.status(500).send({ message: 'Erro ao atualizar ip', data: false })
        }

    })


    app.post('/blockip', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            limit: z.number(),
        })
        const { name, limit } = bodySchema.parse(req.body)
        const ip = req.ip; // Captura o IP do cliente
        console.log(`IP do cliente: ${ip}`);

        try {

            const dataIp = await prisma.ips.findFirst({
                where: {
                    ip: ip,
                    name: name,
                }
            }).then(async (dataIp) => {
                await prisma.ips.update({
                    where: {
                        id: dataIp?.id,
                    },
                    data: {
                        played: limit,
                    }
                })
                res.status(200).send({ message: 'Ip Atualizado Com Sucesso', data: false })
            })


        } catch (error) {
            res.status(500).send({ message: 'Erro ao atualizar ip', data: false })
        }
    })


    app.post('/stateip', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            typ: z.number(),
        })
        const { name, typ } = bodySchema.parse(req.body)
        const ip = req.ip; // Captura o IP do cliente
        console.log(`IP do cliente: ${ip} rota /stateip`);

        if (typ) {
            var limit = await prisma.balao.findFirst({
                where: {
                    name: name,
                },
                select: {
                    limitUse: true,
                }
            })
        } else {
            var limit = await prisma.rolette.findFirst({
                where: {
                    name: name,
                },
                select: {
                    limitUse: true,
                }
            })
        }

        const dataIp = await prisma.ips.findFirst({
            where: {
                ip: ip,
                name: name,
            }
        }).then(async (dataIp) => {
            if (dataIp?.played && limit?.limitUse) {
                console.log(limit?.limitUse)
                if (dataIp?.played >= limit?.limitUse) {
                    res.status(200).send({ message: 'Tentativas esgotadas!', data: false })
                    console.log('Tentativas esgotadas!')
                } else {
                    console.log('Tentativas não esgotadas!')
                    res.status(200).send({ message: 'Ip Ok', data: true })
                }

            }
        })
    })

}
