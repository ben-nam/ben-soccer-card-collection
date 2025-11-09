'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MembershipPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Membership Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to become a member and start selling your cards.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to become a member')
      }

      setSuccess(true)
      router.push('/profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Become a Member - It's Free!
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Member Benefits:</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Sell your soccer cards on the platform</li>
              <li>Access to trading features</li>
              <li>Priority support</li>
              <li>Special member-only deals</li>
            </ul>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Welcome to the Community!</h3>
              <p className="text-gray-600 mb-4">You are now a member. You can start selling your cards.</p>
              <button
                onClick={() => router.push('/sell')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Start Selling
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+1 (555) 123-4567"
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
                {loading ? 'Processing...' : 'Become a Member (Free)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

