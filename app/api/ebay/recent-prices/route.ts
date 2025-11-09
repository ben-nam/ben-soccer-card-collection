import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ updates: [] })
    }

    // Get recent price updates from the last 24 hours
    const recentPrices = await prisma.priceHistory.findMany({
      where: {
        source: 'ebay',
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        card: {
          select: {
            id: true,
            name: true,
            playerName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    })

    // Get previous prices to calculate changes
    const updates = await Promise.all(
      recentPrices.map(async (current) => {
        const previous = await prisma.priceHistory.findFirst({
          where: {
            cardId: current.cardId,
            source: 'ebay',
            date: {
              lt: current.date,
            },
          },
          orderBy: {
            date: 'desc',
          },
        })

        const change = previous
          ? ((current.price - previous.price) / previous.price) * 100
          : undefined

        return {
          cardId: current.card.id,
          cardName: current.card.name,
          playerName: current.card.playerName,
          latestPrice: current.price,
          lastUpdated: current.date.toISOString(),
          change,
        }
      })
    )

    return NextResponse.json({ updates })
  } catch (error) {
    console.error('Error fetching recent prices:', error)
    return NextResponse.json({ updates: [] })
  }
}

