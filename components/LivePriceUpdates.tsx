'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PriceUpdate {
  cardId: string
  cardName: string
  playerName: string
  latestPrice: number | null
  lastUpdated: string | null
  change?: number
}

export default function LivePriceUpdates() {
  const [updates, setUpdates] = useState<PriceUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPriceUpdates = async () => {
      try {
        // Fetch recent price updates from the API
        const response = await fetch('/api/ebay/recent-prices')
        if (response.ok) {
          const data = await response.json()
          setUpdates(data.updates || [])
        }
      } catch (error) {
        console.error('Error fetching price updates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPriceUpdates()
    // Refresh every 5 minutes
    const interval = setInterval(fetchPriceUpdates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-500 animate-pulse">●</span>
          Live Price Updates
        </h3>
        <div className="text-center py-8 text-gray-500">Loading price updates...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-green-500 animate-pulse">●</span>
          Live Price Updates
        </h3>
        <span className="text-sm text-gray-500">Updated daily from eBay</span>
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No price updates available yet.</p>
          <p className="text-sm mt-2">Prices are updated daily from eBay.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.slice(0, 5).map((update) => (
            <Link
              key={update.cardId}
              href={`/listings?cardId=${update.cardId}`}
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{update.playerName}</p>
                  <p className="text-xs text-gray-600">{update.cardName}</p>
                </div>
                <div className="text-right ml-4">
                  {update.latestPrice ? (
                    <>
                      <p className="font-bold text-primary-600">
                        ${update.latestPrice.toFixed(2)}
                      </p>
                      {update.change !== undefined && (
                        <p
                          className={`text-xs ${
                            update.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {update.change >= 0 ? '+' : ''}
                          {update.change.toFixed(1)}%
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">N/A</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <Link
          href="/search"
          className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
        >
          View all cards →
        </Link>
      </div>
    </div>
  )
}

