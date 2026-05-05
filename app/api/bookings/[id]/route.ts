import prisma from '@/lib/db'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const bookingId = parseInt(id, 10)
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'معرف الحجز غير صحيح' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: user.id },
      include: { spot: true }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'الحجز غير موجود أو لا ينتمي إليك' },
        { status: 404 }
      )
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'الحجز ملغى بالفعل' },
        { status: 400 }
      )
    }

    // Cancel booking and update spot status in a single transaction
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' }
      })

      // Update spot status to available
      await tx.parkingSpot.update({
        where: { id: booking.spotId },
        data: { status: 'available' }
      })
    })

    revalidatePath('/')
    revalidatePath('/booking')
    revalidatePath('/form')
    revalidatePath('/dashboard')
    revalidatePath('/ticket')

    return NextResponse.json(
      { success: true, message: 'تم إلغاء الحجز بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إلغاء الحجز' },
      { status: 500 }
    )
  }
}
