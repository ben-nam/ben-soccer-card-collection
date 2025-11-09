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

    const { type, amount, cardId, message } = await req.json()

    if (type !== 'money' && type !== 'card') {
      return NextResponse.json(
        { error: 'Invalid donation type' },
        { status: 400 }
      )
    }

    if (type === 'money' && (!amount || amount <= 0)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (type === 'card' && !cardId) {
      return NextResponse.json(
        { error: 'Card ID is required for card donations' },
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

    // Create donation record
    await prisma.donation.create({
      data: {
        userId: session.user.id,
        type,
        amount: type === 'money' ? amount : undefined,
        cardId: type === 'card' ? cardId : undefined,
        message: message || undefined,
      },
    })

    // Note: In production, you would integrate with Stripe for money donations
    // For now, we just record the donation

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Donation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

