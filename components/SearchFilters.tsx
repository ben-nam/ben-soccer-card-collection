'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const BRANDS = ['Panini', 'Topps', 'Upper Deck', 'Futera', 'Match Attax', 'Other']
const LEAGUES = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS', 'World Cup', 'Champions League', 'Other']
const CARD_TYPES = ['base', 'numbered', 'signature']

export default function SearchFilters() {
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [league, setLeague] = useState('')
  const [cardType, setCardType] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get params from URL on client side only
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setBrand(params.get('brand') || '')
      setLeague(params.get('league') || '')
      setCardType(params.get('cardType') || '')
    }
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search)
      if (currentParams.get('q')) params.set('q', currentParams.get('q')!)
    }
    if (brand) params.set('brand', brand)
    if (league) params.set('league', league)
    if (cardType) params.set('cardType', cardType)
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setBrand('')
    setLeague('')
    setCardType('')
    const params = new URLSearchParams()
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search)
      if (currentParams.get('q')) params.set('q', currentParams.get('q')!)
    }
    router.push(`/search?${params.toString()}`)
  }

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">Loading filters...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Brands</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            League/Competition
          </label>
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Leagues</option>
            {LEAGUES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Type
          </label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            {CARD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

