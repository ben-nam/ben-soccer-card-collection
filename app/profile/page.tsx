import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      listings: {
        where: { isActive: true },
        include: { card: true },
        take: 10,
      },
      _count: {
        select: {
          listings: true,
          trades: true,
          donations: true,
        },
      },
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-primary-600">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Member Status</p>
                  <p className="font-semibold">
                    {user.isMember ? (
                      <span className="text-green-600">✓ Member</span>
                    ) : (
                      <span className="text-gray-400">Not a member</span>
                    )}
                  </p>
                </div>

                {user.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Stats</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Listings:</span>
                      <span className="font-semibold">{user._count.listings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trades:</span>
                      <span className="font-semibold">{user._count.trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Donations:</span>
                      <span className="font-semibold">{user._count.donations}</span>
                    </div>
                  </div>
                </div>

                {!user.isMember && (
                  <Link
                    href="/membership"
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Become a Member
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">My Listings</h3>
              {user.listings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any active listings.</p>
                  <Link
                    href="/sell"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Start selling your cards
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{listing.title}</h4>
                          <p className="text-sm text-gray-600">
                            {listing.card.playerName} - {listing.card.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            ${listing.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">{listing.condition}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

