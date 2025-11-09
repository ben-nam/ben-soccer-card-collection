import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SearchBar from '@/components/SearchBar'
import BestSellers from '@/components/BestSellers'
import FeaturedCards from '@/components/FeaturedCards'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">Soccer Card Seller</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The world's premier platform for buying, selling, and trading soccer cards.
            Find cards from all major leagues, competitions, and brands.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar />
          </div>

          {!session && (
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/membership"
                className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Become a Member
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Selling Cards
          </h2>
          <BestSellers />
        </div>
      </section>

      {/* Featured Cards Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Cards
          </h2>
          <FeaturedCards />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Soccer Card Seller?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Search by player, brand, league, competition, and card type. Find exactly what you're looking for.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Live eBay Prices</h3>
              <p className="text-gray-600">
                Get daily updated prices from eBay to ensure you're getting the best deals.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Safe Trading</h3>
              <p className="text-gray-600">
                Trade cards securely with delivery tracking. Zero tolerance for scams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

