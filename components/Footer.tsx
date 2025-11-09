import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Soccer Card Seller</h3>
            <p className="text-gray-400">
              The world's premier platform for buying, selling, and trading soccer cards.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/search" className="hover:text-white">Search Cards</Link></li>
              <li><Link href="/browse" className="hover:text-white">Browse</Link></li>
              <li><Link href="/membership" className="hover:text-white">Membership</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/auth/signin" className="hover:text-white">Sign In</Link></li>
              <li><Link href="/sell" className="hover:text-white">Sell Cards</Link></li>
              <li><Link href="/trades" className="hover:text-white">Trades</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/donate" className="hover:text-white">Donate</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Soccer Card Seller. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

