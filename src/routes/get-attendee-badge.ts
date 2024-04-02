import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/badge", {
      schema: {
        params: z.object({
          attendeeId: z.string(),
        }),
        response: {},
      }
    }, async (req, reply) => {

      const { attendeeId } = req.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          publicId: attendeeId
        }
      })

      if(attendee === null) {
        throw new Error("Attendee not found.")
      }

      return reply.status(200).send({
        attendee
      })
    })


}