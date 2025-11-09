'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Error</h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'A server-side exception has occurred'}
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Go Home
          </a>
        </div>
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
          <p className="text-sm text-yellow-800 font-semibold mb-2">Common Issues:</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• DATABASE_URL environment variable not set</li>
            <li>• NEXTAUTH_SECRET environment variable not set</li>
            <li>• Database connection failed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

