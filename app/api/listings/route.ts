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

    const body = await req.json()
    const {
      title,
      playerName,
      brand,
      set,
      league,
      competition,
      year,
      cardType,
      cardNumber,
      isSignature,
      price,
      condition,
      description,
      imageUrl,
    } = body

    // Validate required fields
    if (!title || !playerName || !brand || !set || !league || !year || !cardType || !price || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user is banned
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true, isMember: true },
    })

    if (user?.isBanned) {
      return NextResponse.json(
        { error: 'Your account has been banned' },
        { status: 403 }
      )
    }

    if (!user?.isMember) {
      return NextResponse.json(
        { error: 'Membership required to sell cards' },
        { status: 403 }
      )
    }

    // Create or find card
    let card = await prisma.card.findFirst({
      where: {
        playerName,
        brand,
        set,
        league,
        year,
        cardType,
      },
    })

    if (!card) {
      card = await prisma.card.create({
        data: {
          name: `${playerName} ${brand} ${set} ${year}`,
          playerName,
          brand,
          set,
          league,
          competition: competition || undefined,
          year,
          cardType,
          cardNumber: cardNumber || undefined,
          isSignature: isSignature || false,
          imageUrl: imageUrl || undefined,
        },
      })
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        cardId: card.id,
        userId: session.user.id,
        title,
        description: description || undefined,
        price: parseFloat(price),
        condition,
        imageUrl: imageUrl || undefined,
      },
    })

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

