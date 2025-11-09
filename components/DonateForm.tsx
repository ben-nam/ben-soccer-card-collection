'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DonateForm({ userId }: { userId?: string }) {
  const router = useRouter()
  const [donationType, setDonationType] = useState<'money' | 'card'>('money')
  const [amount, setAmount] = useState('')
  const [cardId, setCardId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: donationType,
          amount: donationType === 'money' ? parseFloat(amount) : undefined,
          cardId: donationType === 'card' ? cardId : undefined,
          message,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process donation')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
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
        <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
        <p className="text-gray-600">Your donation has been received. We appreciate your support!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Type
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setDonationType('money')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              donationType === 'money'
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Money
          </button>
          <button
            type="button"
            onClick={() => setDonationType('card')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              donationType === 'card'
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Soccer Card
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {donationType === 'money' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="10.00"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card ID
            </label>
            <input
              type="text"
              required
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter card ID or listing ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can find the card ID on the card listing page
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add a message with your donation..."
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
          {loading ? 'Processing...' : 'Submit Donation'}
        </button>
      </form>
    </div>
  )
}

