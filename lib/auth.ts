import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

// Note: Clever and Instagram providers would need custom implementation
// For now, we'll use Google and add placeholders for the others

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isBanned: true, isMember: true },
        })
        if (dbUser?.isBanned) {
          throw new Error('Your account has been banned')
        }
        session.user.isMember = dbUser?.isMember || false
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

