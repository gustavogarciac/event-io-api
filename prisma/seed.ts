import { prisma } from "../src/lib/prisma"

async function seed() {
  await prisma.event.create({
    data: {
      id: '74114f8d-fa23-4aad-909e-730079540abd',
      title: "Unite Summit",
      details: "A conference for developers",
      slug: "unite-summit",
      maximumAttendees: 120,
    }
  })
}

seed().then(() => {
  console.log("Database seeded!")
  prisma.$disconnect()
})