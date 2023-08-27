import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
require('dotenv').config();
import { z } from "zod";


export async function util(app: FastifyInstance) {

    app.post('/util', async (req, res) => {
        const bodySchema = z.object({
            link: z.string(),
            zap: z.string(),
        })
        const { zap, link } = bodySchema.parse(req.body)

        const item = await prisma.utils.findMany().then(async (item) => {
            if (item) {
                await prisma.utils.update({
                    where: {
                        id: item[0].id
                    },
                    data: {
                        zap: zap,
                        url: link
                    }
                })
            } else {
                await prisma.utils.create({
                    data: {
                        zap: zap,
                        url: link
                    }
                })
            }
        })

    })

    app.get('/getzap', async (req, res) => {
        const zap = process.env.ZAP;
        res.send({ zap })
    })

    app.get('/geturl', async (req, res) => {
        const url = process.env.URL;
        res.send({ url })
    })
}