import dynamic from 'next/dynamic'

const SearchFilters = dynamic(() => import('@/components/SearchFilters'), {
  ssr: false,
})

const SearchResults = dynamic(() => import('@/components/SearchResults'), {
  ssr: false,
})

// Prevent static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
export const runtime = 'nodejs'

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
            <SearchFilters />
          </div>
          
          <div className="lg:col-span-3">
            <SearchResults searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  )
}

