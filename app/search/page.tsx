import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'

export const dynamic = 'force-dynamic'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; brand?: string; league?: string; cardType?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Soccer Cards</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="bg-white p-6 rounded-lg shadow-md">Loading filters...</div>}>
              <SearchFilters />
            </Suspense>
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

