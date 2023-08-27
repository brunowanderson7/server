import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function login(app: FastifyInstance) {

    app.post('/login', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            password: z.string(),
        })
        const { name, password } = bodySchema.parse(req.body)

        try {
            const user = await prisma.admin.findFirst({
                where: {
                    name: name,
                }
            })
            if (user && user.password === password) {
                const token = {
                    "name": user.name,
                    "id": user.id,
                    "master": user.master,
                }
                res.status(200).send({ message: '200', data: token })
            } else {
                res.status(401).send({ message: '401', data: false })
            }
        } catch (error) {
            res.status(500).send({ message: '500' })
        }
    })


    app.post('/adduser', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            password: z.string(),
            limitUse: z.number(),
        })
        const { name, password, limitUse } = bodySchema.parse(req.body)

        try {
            await prisma.admin.create({
                data: {
                    name,
                    password,
                    limitUse,
                    master: false,
                }
            })
            res.status(200).send({ message: 'Add user success', data: true })
            console.log('Add user success')


        } catch (error) {
            res.status(500).send({ message: 'Error add user', data: false })
        }
    })


    app.delete('/deleteuser', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        try {
            const id = await findUser(name)

            if (id) {
                await prisma.admin.delete({
                    where: {
                        id: id,
                    }
                })
                res.status(200).send({ message: 'User Deleted', data: true })
                console.log('User Deleted')
            }

        } catch (error) {
            res.status(500).send({ message: 'Error add user', data: false })
        }
    })


    app.post('/finduser', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(req.body)

        const id = await findUser(name)
        if (id) {
            res.status(200).send({ message: 'Usuário encontardo', data: true })
        } else {
            res.status(200).send({ message: 'Usuário não encontardo', data: false })
        }
    })
}


async function findUser(name: string) {
    const id = await prisma.admin.findFirst({
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