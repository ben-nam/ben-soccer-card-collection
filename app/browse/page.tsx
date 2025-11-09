import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Soccer Cards</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>
          
          <div className="lg:col-span-3">
            <SearchResults searchParams={{}} />
          </div>
        </div>
      </div>
    </div>
  )
}

