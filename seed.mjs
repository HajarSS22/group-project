import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mockSpots = [
  { id: 1, lat: 25.8696, lng: 43.4975, address: 'مواقف بوليفارد الرس A1', status: 'available', price: 5 },
  { id: 2, lat: 25.8694, lng: 43.4972, address: 'مواقف بوليفارد الرس A2', status: 'booked', price: 5 },
  { id: 3, lat: 25.8700, lng: 43.4980, address: 'مواقف السوق التجاري B1', status: 'available', price: 10 },
  { id: 4, lat: 25.8685, lng: 43.4960, address: 'مواقف الواحة سنتر B2', status: 'available', price: 10 },
  { id: 5, lat: 25.8690, lng: 43.4965, address: 'مواقف الواحة سنتر C1', status: 'booked', price: 5 },
];

async function main() {
  console.log('Seeding database...')
  for (const spot of mockSpots) {
    await prisma.parkingSpot.upsert({
      where: { id: spot.id },
      update: spot,
      create: spot,
    })
  }
  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
