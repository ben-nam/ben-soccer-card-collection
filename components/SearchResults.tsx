import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function searchCards(params: { q?: string; brand?: string; league?: string; cardType?: string }) {
  try {
    // Skip database query if DATABASE_URL is not available (during build)
    if (!process.env.DATABASE_URL) {
      return []
    }
    const where: any = {
      isActive: true,
    }

    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { card: { playerName: { contains: params.q, mode: 'insensitive' } } },
        { card: { name: { contains: params.q, mode: 'insensitive' } } },
      ]
    }

    if (params.brand) {
      where.card = { ...where.card, brand: params.brand }
    }

    if (params.league) {
      where.card = { ...where.card, league: params.league }
    }

    if (params.cardType) {
      where.card = { ...where.card, cardType: params.cardType }
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

    return listings
  } catch (error) {
    console.error('Error searching cards:', error)
    return []
  }
}

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q?: string; brand?: string; league?: string; cardType?: string }
}) {
  // Handle missing DATABASE_URL gracefully
  let listings: any[] = []
  try {
    listings = await searchCards(searchParams)
  } catch (error) {
    console.error('Error in SearchResults:', error)
    listings = []
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No cards found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Found {listings.length} card(s)</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              {listing.card.imageUrl ? (
                <img
                  src={listing.card.imageUrl}
                  alt={listing.card.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {listing.card.playerName} - {listing.card.brand} {listing.card.set}
              </p>
              <p className="text-gray-500 text-xs mb-2">
                {listing.card.league} {listing.card.competition && `- ${listing.card.competition}`}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  ${listing.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">{listing.condition}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

