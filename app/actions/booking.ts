'use server'

import prisma from '@/lib/db'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getParkingSpots() {
  const spots = await prisma.parkingSpot.findMany({
    orderBy: { id: 'asc' }
  })
  return JSON.parse(JSON.stringify(spots))
}

export async function createBooking(spotId: number, durationHours: number, plate: string) {
  try {
    const user = await getUser()
    if (!user) {
      return { error: 'يرجى تسجيل الدخول أولاً' }
    }

    const spot = await prisma.parkingSpot.findUnique({ where: { id: spotId } })
    if (!spot) {
      return { error: 'الموقف غير موجود' }
    }

    if (spot.status === 'booked') {
      return { error: 'عذراً، تم حجز هذا الموقف للتو' }
    }

    // Create booking and update spot status in a single transaction
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          spotId: spot.id,
          startTime: new Date(),
          duration: durationHours,
          totalPrice: spot.price * durationHours,
        }
      })

      // Update spot status to booked
      await tx.parkingSpot.update({
        where: { id: spot.id },
        data: { status: 'booked' }
      })

      return newBooking
    })

    revalidatePath('/')
    revalidatePath('/booking')
    revalidatePath('/form')
    revalidatePath('/dashboard')

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error('Booking error:', error)
    return { error: 'حدث خطأ أثناء تأكيد الحجز' }
  }
}

export async function getUserBookings() {
   const user = await getUser()
   if (!user) return []

   const bookings = await prisma.booking.findMany({
     where: { userId: user.id },
     include: { spot: true },
     orderBy: { createdAt: 'desc' }
   })
   return JSON.parse(JSON.stringify(bookings))
}

export async function getBookingDetails(bookingId: number) {
    const user = await getUser()
    if (!user) return null
 
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: user.id },
      include: { spot: true, user: true }
    })
    return JSON.parse(JSON.stringify(booking))
}
