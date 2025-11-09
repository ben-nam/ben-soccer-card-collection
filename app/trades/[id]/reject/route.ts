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
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    if (trade.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to reject this trade' },
        { status: 403 }
      )
    }

    if (trade.status !== 'pending') {
      return NextResponse.json(
        { error: 'Trade is not in pending status' },
        { status: 400 }
      )
    }

    await prisma.trade.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Trade rejection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

