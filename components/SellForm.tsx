'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BRANDS = ['Panini', 'Topps', 'Upper Deck', 'Futera', 'Match Attax', 'Other']
const LEAGUES = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS', 'World Cup', 'Champions League', 'Other']
const CARD_TYPES = ['base', 'numbered', 'signature']
const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair']

export default function SellForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    playerName: '',
    brand: '',
    set: '',
    league: '',
    competition: '',
    year: new Date().getFullYear(),
    cardType: 'base',
    cardNumber: '',
    isSignature: false,
    price: '',
    condition: 'Mint',
    description: '',
    imageUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create listing')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold mb-2">Listing Created!</h2>
        <p className="text-gray-600">Your card listing has been created successfully.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Lionel Messi 2022 Panini World Cup"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              required
              value={formData.playerName}
              onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <select
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Brand</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set *
            </label>
            <input
              type="text"
              required
              value={formData.set}
              onChange={(e) => setFormData({ ...formData, set: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., World Cup 2022"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League *
            </label>
            <select
              required
              value={formData.league}
              onChange={(e) => setFormData({ ...formData, league: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select League</option>
              {LEAGUES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition
            </label>
            <input
              type="text"
              value={formData.competition}
              onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., World Cup, Champions League"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Type *
            </label>
            <select
              required
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CARD_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number (if numbered)
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 23/99"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isSignature"
            checked={formData.isSignature}
            onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isSignature" className="ml-2 block text-sm text-gray-700">
            This is a signature card
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              required
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add any additional details about the card..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}

