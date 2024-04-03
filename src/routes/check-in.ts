import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/check-in", {
      schema: {
        params: z.object({
          attendeeId: z.string(),
        }),
        response: {
          201: z.null()
        }
      }
    }, async (req, reply) => {
      const { attendeeId } = req.params
      
      const attendeeCheckIn = await prisma.checkIn.findFirst({
        where: {
          attendeeId
        }
      })

      if (attendeeCheckIn !== null) {
        throw new Error("Attendee already checked in")
      }

      await prisma.checkIn.create({
        data: {
          attendeeId
        }
      })

      return reply.status(201).send()
    })
}