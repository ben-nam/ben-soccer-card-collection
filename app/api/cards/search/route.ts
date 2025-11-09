import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ listings: [] })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const brand = searchParams.get('brand')
    const league = searchParams.get('league')
    const cardType = searchParams.get('cardType')

    const where: any = {
      isActive: true,
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { card: { playerName: { contains: q, mode: 'insensitive' } } },
        { card: { name: { contains: q, mode: 'insensitive' } } },
      ]
    }

    if (brand) {
      where.card = { ...where.card, brand }
    }

    if (league) {
      where.card = { ...where.card, league }
    }

    if (cardType) {
      where.card = { ...where.card, cardType }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        card: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Error searching cards:', error)
    return NextResponse.json({ listings: [] })
  }
}

