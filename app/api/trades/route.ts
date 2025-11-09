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

    const { receiverId, initiatorCardId, receiverCardId, deliveryAddress } = await req.json()

    if (!receiverId || !initiatorCardId) {
      return NextResponse.json(
        { error: 'Receiver ID and initiator card ID are required' },
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

    // Verify initiator owns the card
    const initiatorCard = await prisma.listing.findUnique({
      where: { id: initiatorCardId },
      select: { userId: true, isActive: true },
    })

    if (!initiatorCard || initiatorCard.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not own this card' },
        { status: 403 }
      )
    }

    if (!initiatorCard.isActive) {
      return NextResponse.json(
        { error: 'This card listing is not active' },
        { status: 400 }
      )
    }

    // Create trade
    const trade = await prisma.trade.create({
      data: {
        initiatorId: session.user.id,
        receiverId,
        initiatorCardId,
        receiverCardId: receiverCardId || undefined,
        status: 'pending',
        deliveryAddress: deliveryAddress || undefined,
      },
    })

    return NextResponse.json({ success: true, trade })
  } catch (error) {
    console.error('Trade creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

