import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import ReportButton from '@/components/ReportButton'
import TradeButton from '@/components/TradeButton'

async function getListing(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        card: {
          include: {
            priceHistory: {
              where: { source: 'ebay' },
              orderBy: { date: 'desc' },
              take: 1,
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isBanned: true,
          },
        },
      },
    })
    return listing
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

export default async function ListingPage({
  params,
}: {
  params: { id: string }
}) {
  const listing = await getListing(params.id)
  const session = await getServerSession(authOptions)

  if (!listing || !listing.isActive) {
    notFound()
  }

  if (listing.user.isBanned) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Listing Unavailable</h1>
          <p className="text-gray-600">This listing is no longer available.</p>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === listing.userId
  const latestEbayPrice = listing.card.priceHistory[0]?.price

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                {listing.imageUrl || listing.card.imageUrl ? (
                  <img
                    src={listing.imageUrl || listing.card.imageUrl || ''}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-xl text-gray-600">
                {listing.card.playerName} - {listing.card.brand} {listing.card.set} {listing.card.year}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  ${listing.price.toFixed(2)}
                </span>
                {latestEbayPrice && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">eBay Price</p>
                    <p className="text-lg font-semibold">${latestEbayPrice.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold">{listing.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Type:</span>
                  <span className="font-semibold capitalize">{listing.card.cardType}</span>
                </div>
                {listing.card.cardNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number:</span>
                    <span className="font-semibold">{listing.card.cardNumber}</span>
                  </div>
                )}
                {listing.card.isSignature && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Signature:</span>
                    <span className="font-semibold text-green-600">Yes</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">League:</span>
                  <span className="font-semibold">{listing.card.league}</span>
                </div>
                {listing.card.competition && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Competition:</span>
                    <span className="font-semibold">{listing.card.competition}</span>
                  </div>
                )}
              </div>

              {!isOwner && session && (
                <div className="space-y-2">
                  <TradeButton listingId={listing.id} sellerId={listing.userId} />
                  <ReportButton userId={listing.userId} />
                </div>
              )}

              {!session && (
                <Link
                  href="/auth/signin"
                  className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Sign In to Trade or Report
                </Link>
              )}
            </div>

            {listing.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
              <div className="flex items-center space-x-4">
                {listing.user.image ? (
                  <img
                    src={listing.user.image}
                    alt={listing.user.name || 'Seller'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {listing.user.name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{listing.user.name || 'Seller'}</p>
                  <p className="text-sm text-gray-500">{listing.user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

