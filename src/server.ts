import { PrismaClient } from "@prisma/client"
import fastify from "fastify"
import { z } from "zod"

const app = fastify()

const prisma = new PrismaClient({
  log: ["query"],
})

app.post("/events", async (req, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  })

  const {
    title,
    details,
    maximumAttendees,
  } = createEventSchema.parse(req.body)

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug: new Date().toISOString(), 
    }
  })

  return reply.status(201).send({event})
})

app.listen({
  port: 3333,
}).then(() => console.log("🚀 HTTP Server Running"))