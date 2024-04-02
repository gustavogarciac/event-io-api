import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees", {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          })
        }
      }
    }, async (req, reply) => {
      const { eventId } = req.params
      const { name, email } = req.body

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      })

      if (attendeeFromEmail !== null) {
        throw new Error("This email is already registered for this event")
      }

      const [event, amountOfAttendees] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),

        await prisma.attendee.count({
          where: {
            eventId
          }
        })
      ])

      if (event?.maximumAttendees && amountOfAttendees >= event?.maximumAttendees) {
        throw new Error("The maximum number of attendees for this event has already been reached.")
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({ attendeeId: attendee.id })
    })

}