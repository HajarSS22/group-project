import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from './db'

const secretKey = process.env.NEXTAUTH_SECRET || 'secret-for-prototype-only'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        return null
    }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: any) {
  // Not strictly needed for simple prototypes
  return null
}

export async function getUser() {
    const session = await getSession()
    if (!session?.userId) return null
    return prisma.user.findUnique({
        where: { id: session.userId as string },
        select: { id: true, email: true, name: true, phone: true }
    })
}
