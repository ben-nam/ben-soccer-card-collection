import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getTrades(userId: string) {
  try {
    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          { initiatorId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        initiator: {
          select: {
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            name: true,
            email: true,
          },
        },
        initiatorCard: {
          include: {
            card: true,
          },
        },
        receiverCard: {
          include: {
            card: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return trades
  } catch (error) {
    console.error('Error fetching trades:', error)
    return []
  }
}

export default async function TradesList({ userId }: { userId: string }) {
  const trades = await getTrades(userId)

  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 mb-4">You don't have any trades yet.</p>
        <Link
          href="/browse"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Browse cards to start trading
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <div key={trade.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Trade #{trade.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium">{trade.status}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              trade.status === 'completed' ? 'bg-green-100 text-green-800' :
              trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              trade.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {trade.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">You're trading:</p>
              <p className="font-medium">{trade.initiatorCard.title}</p>
              <p className="text-sm text-gray-500">
                {trade.initiatorCard.card.playerName} - {trade.initiatorCard.card.brand}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">For:</p>
              {trade.receiverCard ? (
                <>
                  <p className="font-medium">{trade.receiverCard.title}</p>
                  <p className="text-sm text-gray-500">
                    {trade.receiverCard.card.playerName} - {trade.receiverCard.card.brand}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Card selection pending</p>
              )}
            </div>
          </div>

          {trade.trackingNumber && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Tracking: {trade.trackingNumber}</p>
            </div>
          )}

          {trade.status === 'pending' && trade.receiverId === userId && (
            <div className="flex gap-2 mt-4">
              <Link
                href={`/trades/${trade.id}/accept`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Accept Trade
              </Link>
              <Link
                href={`/trades/${trade.id}/reject`}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

