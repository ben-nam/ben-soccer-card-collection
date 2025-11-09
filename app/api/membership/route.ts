import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, phone } = await req.json()

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if user is banned
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true },
    })

    if (user?.isBanned) {
      return NextResponse.json(
        { error: 'Your account has been banned' },
        { status: 403 }
      )
    }

    // Update user with membership info
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        isMember: true,
        memberSince: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Membership error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

