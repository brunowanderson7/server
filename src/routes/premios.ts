import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";



export async function premios(app: FastifyInstance) {

    app.post('/addpremio', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            amount: z.number(),
            info: z.string(),
        })
        const { name, amount, info } = bodySchema.parse(req.body)
        console.log(req.body)

        try {
            await prisma.premio.create({
                data: {
                    name,
                    amount,
                    info,
                }
            })
            res.status(200).send({ message: 'Prêmio adicionado com sucesso', data: true })
            console.log('Prêmio adicionado com sucesso')

        } catch (error) {
            res.status(500).send({ message: 'Erro ao adicionar prêmio', data: false })
        }
    })


    app.post('/updatepremio', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        try {
            const premio = await prisma.premio.findFirst({
                where: {
                    name: name,
                }
            }).then(async (premio) => {
                if (premio) {
                    const limit = premio.amount - 1
                    if (limit > 0) {
                        await prisma.premio.update({
                            where: {
                                id: premio.id,
                            },
                            data: {
                                amount: limit,
                            }
                        })
                        res.status(200).send({ message: 'Prêmio atualizado', data: true })
                        console.log('Prêmio atualizado')
                    } else {
                        await prisma.premio.update({
                            where: {
                                id: premio.id,
                            },
                            data: {
                                name: "Resgatado",
                                amount: 999,
                                info: "Esse Prêmio já foi Resgatado",
                            }
                        })
                        res.status(200).send({ message: 'Prêmio atualizado', data: true })
                        console.log('Prêmio atualizado')
                    }
                }
            })

        } catch (error) {
            res.status(500).send({ message: 'Erro ao atualizar prêmio', data: false })
        }

    })


    app.delete('/deletepremio', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        try {
            const id = await findPremio(name)

            if (id) {
                await prisma.premio.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).send({ message: 'Prêmio Deletado', data: true })
                console.log('Prêmio Deletedo')
            }

        } catch (error) {
            res.status(500).send({ message: 'Erro ao Deletar Prêmio', data: false })
        }
    })

    app.post('/findpremio', async (req, res) => {
        console.log(req.body)
        const bodySchema = z.object({
            id: z.string(),
        })
        const { id } = bodySchema.parse(req.body)

        console.log(id)

        try {
            const item = await prisma.premio.findMany({
                where: {
                    id: id,
                }
            })
            res.status(200).send({ message: 'Prêmio encontrado', data: item })
            console.log('Prêmio encontrado')
        } catch (error) {
            res.status(500).send({ message: 'Prêmio não encontrado', data: false })
        }
    })



    app.post('/getname', async (req, res) => {
        console.log(req.body)
        const bodySchema = z.object({
            id: z.string(),
        })
        const { id } = bodySchema.parse(req.body)

        console.log(id)

        try {
            const item = await prisma.premio.findMany({
                where: {
                    id: id,
                },
                select: {
                    name: true,
                }
            })
            res.status(200).send({ message: 'Prêmio encontrado', data: item })
            console.log(item)
            console.log('Prêmio encontrado')
        } catch (error) {
            res.status(500).send({ message: 'Prêmio não encontrado', data: false })
        }
    })


    app.post('/getnames2', async (req, res) => {
        console.log(req.body)
        const bodySchema = z.object({
            id: z.string(),
        })
        const { id } = bodySchema.parse(req.body)

        const newIds = id.split(',')
        console.log(newIds)

        try {
            console.log("aqui")
            const item = newIds.map(async (item) => {
                const item2 = await prisma.premio.findMany({
                    where: {
                        id: item,
                    },
                    select: {
                        name: true,
                    }
                })
                const { name } = item2[0]
                return name
            })

            const resolvedItems = await Promise.all(item);

            console.log(resolvedItems)


            res.status(200).send({ message: 'Prêmios encontrado', data: resolvedItems })
            console.log(item)
            console.log('Prêmio encontrado')
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Prêmios não encontrado', data: false })
        }
    })



    app.get('/listpremios', async (req, res) => {
        try {
            const item = await prisma.premio.findMany()
            res.status(200).send({ message: 'Prêmios encontrados', data: item })
            console.log('Prêmios encontrados')
        } catch (error) {
            res.status(500).send({ message: 'Prêmios não encontrados', data: false })
        }
    })

}


async function findPremio(name: string) {
    const id = await prisma.premio.findFirst({
        where: {
            name: name,
        },
        select: {
            id: true,
        }
    })

    if (id) {
        return id.id
    } else {
        return false
    }
}