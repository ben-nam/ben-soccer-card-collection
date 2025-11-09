import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DonateForm from '@/components/DonateForm'

export default async function DonatePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Donate to Soccer Card Seller
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Support our platform by donating money or soccer cards. Your contributions help us maintain
          and improve the platform for everyone.
        </p>
        <DonateForm userId={session?.user?.id} />
      </div>
    </div>
  )
}

