'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TradeButton({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: sellerId,
          initiatorCardId: listingId, // In a real app, you'd select your own card
          deliveryAddress,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to initiate trade')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/trades')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
      >
        Initiate Trade
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Initiate Trade</h2>
            
            {success ? (
              <div className="text-center py-4">
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <p className="text-gray-700">Trade initiated successfully!</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to trades...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your delivery address..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This address will be shared with the seller for card delivery
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Initiate Trade'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

