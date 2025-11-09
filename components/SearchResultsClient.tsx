'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  card: {
    name: string
    playerName: string
    brand: string
    set: string
    league: string
    competition: string | null
    imageUrl: string | null
  }
}

export default function SearchResultsClient({
  searchParams,
}: {
  searchParams: { q?: string; brand?: string; league?: string; cardType?: string }
}) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const params = new URLSearchParams()
        if (searchParams.q) params.set('q', searchParams.q)
        if (searchParams.brand) params.set('brand', searchParams.brand)
        if (searchParams.league) params.set('league', searchParams.league)
        if (searchParams.cardType) params.set('cardType', searchParams.cardType)

        const response = await fetch(`/api/cards/search?${params.toString()}`)
        const data = await response.json()
        setListings(data.listings || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [searchParams.q, searchParams.brand, searchParams.league, searchParams.cardType])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
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

