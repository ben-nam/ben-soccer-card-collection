import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getFeaturedCards() {
  try {
    // Skip database query if DATABASE_URL is not available (during build)
    if (!process.env.DATABASE_URL) {
      return []
    }
    const listings = await prisma.listing.findMany({
      where: {
        isActive: true,
      },
      take: 6,
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
    })
    return listings
  } catch (error) {
    console.error('Error fetching featured cards:', error)
    return []
  }
}

export default async function FeaturedCards() {
  const listings = await getFeaturedCards()

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No featured cards available at the moment.</p>
      </div>
    )
  }

  return (
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
  )
}

