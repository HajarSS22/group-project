'use server'

import { cookies } from 'next/headers'
import { encrypt } from '@/lib/auth'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function signup(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    if (!email || !password || !name) {
      return { error: 'جميع الحقول مطلوبة' }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: 'هذا البريد الإلكتروني مسجل مسبقاً' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    })

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: user.id, email: user.email })

    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'حدث خطأ غير متوقع' }
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      return { error: 'بيانات الدخول غير صحيحة' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return { error: 'بيانات الدخول غير صحيحة' }
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: user.id, email: user.email })
    
    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'حدث خطأ غير متوقع' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getUserProfile() {
  const { getUser } = await import('@/lib/auth')
  const user = await getUser()
  return user ? JSON.parse(JSON.stringify(user)) : null
}
