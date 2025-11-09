import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

// Note: Clever and Instagram providers would need custom implementation
// For now, we'll use Google and add placeholders for the others

// Helper function to safely get PrismaAdapter
function getAdapter() {
  if (!process.env.DATABASE_URL) {
    return undefined
  }
  try {
    return PrismaAdapter(prisma)
  } catch (error) {
    console.error('Error initializing PrismaAdapter:', error)
    return undefined
  }
}

export const authOptions: NextAuthOptions = {
  // Only use PrismaAdapter if DATABASE_URL is available
  adapter: getAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Clever and Instagram would require custom OAuth implementations
    // These can be added as custom providers
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && process.env.DATABASE_URL) {
        try {
          session.user.id = user.id
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isBanned: true, isMember: true },
          })
          if (dbUser?.isBanned) {
            throw new Error('Your account has been banned')
          }
          session.user.isMember = dbUser?.isMember || false
        } catch (error) {
          // Handle database errors gracefully
          console.error('Error fetching user data:', error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
}

