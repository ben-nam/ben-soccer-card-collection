import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
let prismaInstance: PrismaClient | null = null

if (process.env.DATABASE_URL) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
}

// Export a proxy that handles missing DATABASE_URL gracefully
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      // Return a mock object that throws helpful errors
      return () => {
        throw new Error('DATABASE_URL is not configured. Please set it in your environment variables.')
      }
    }
    return (prismaInstance as any)[prop]
  },
}) as PrismaClient

