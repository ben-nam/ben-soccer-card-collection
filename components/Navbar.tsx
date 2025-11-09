'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Soccer Card Seller
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-700 hover:text-primary-600">
              Search Cards
            </Link>
            <Link href="/browse" className="text-gray-700 hover:text-primary-600">
              Browse
            </Link>
            {session ? (
              <>
                <Link href="/sell" className="text-gray-700 hover:text-primary-600">
                  Sell Cards
                </Link>
                <Link href="/trades" className="text-gray-700 hover:text-primary-600">
                  Trades
                </Link>
                <Link href="/donate" className="text-gray-700 hover:text-primary-600">
                  Donate
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/search" className="block text-gray-700 hover:text-primary-600">
              Search Cards
            </Link>
            <Link href="/browse" className="block text-gray-700 hover:text-primary-600">
              Browse
            </Link>
            {session ? (
              <>
                <Link href="/sell" className="block text-gray-700 hover:text-primary-600">
                  Sell Cards
                </Link>
                <Link href="/trades" className="block text-gray-700 hover:text-primary-600">
                  Trades
                </Link>
                <Link href="/donate" className="block text-gray-700 hover:text-primary-600">
                  Donate
                </Link>
                <Link href="/profile" className="block text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block text-gray-700 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

