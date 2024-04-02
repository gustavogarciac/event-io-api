import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { z } from "zod"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post("/events", {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      }),
      response: {
        201: z.object({
          event: z.object({
            id: z.string(),
            title: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().positive().nullable(),
            slug: z.string(),
          }),
        })
      }
    }
  }, async (req, reply) => {

  const {
    title,
    details,
    maximumAttendees,
  } = req.body

  const slug = generateSlug(title)

  const eventWithSameSlug = await prisma.event.findFirst({
    where: {
      slug
    }
  })

  if (eventWithSameSlug !== null) {
    throw new Error("Another event with same title already exists.")
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug
    }
  })

  return reply.status(201).send({event})
})
}