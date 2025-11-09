import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SellForm from '@/components/SellForm'
import { prisma } from '@/lib/prisma'

export default async function SellPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isMember: true, isBanned: true },
  })

  if (user?.isBanned) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Account Banned</h1>
          <p className="text-gray-600">Your account has been banned from selling cards.</p>
        </div>
      </div>
    )
  }

  if (!user?.isMember) {
    redirect('/membership')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sell Your Soccer Cards
        </h1>
        <SellForm userId={session.user.id} />
      </div>
    </div>
  )
}

