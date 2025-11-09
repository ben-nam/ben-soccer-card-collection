import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
      include: {
        receiver: { select: { isBanned: true } },
        initiator: { select: { isBanned: true } },
      },
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    if (trade.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to accept this trade' },
        { status: 403 }
      )
    }

    if (trade.status !== 'pending') {
      return NextResponse.json(
        { error: 'Trade is not in pending status' },
        { status: 400 }
      )
    }

    // Check if either user is banned
    if (trade.receiver.isBanned || trade.initiator.isBanned) {
      return NextResponse.json(
        { error: 'One of the users involved is banned' },
        { status: 403 }
      )
    }

    // Update trade status
    await prisma.trade.update({
      where: { id: params.id },
      data: {
        status: 'accepted',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Trade acceptance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

