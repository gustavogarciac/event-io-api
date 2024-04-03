import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/badge", {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.string(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            })
          })
        },
      }
    }, async (req, reply) => {

      const { attendeeId } = req.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          publicId: true,
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

      const baseURL = `${req.protocol}://${req.hostname}`

      const checkInURL = new URL(`/attendees/${attendee.publicId}/check-in`, baseURL)

      return reply.status(200).send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString()
        }
      })
    })


}