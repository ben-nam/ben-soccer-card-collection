# Soccer Card Seller

A comprehensive platform for buying, selling, and trading soccer cards worldwide.

## Features

- 🔍 **Advanced Search**: Search cards by player, brand, league, competition, and card type
- 💰 **Live eBay Prices**: Daily updated prices from eBay
- 🔐 **Multiple Sign-In Options**: Google, Clever, and Instagram (OAuth)
- 🎴 **Card Management**: Support for base, numbered, and signature cards
- 🤝 **Trading System**: Secure card trading with delivery tracking
- 💳 **Membership System**: Free membership to sell cards (requires name, email, phone)
- 💝 **Donations**: Support the platform with money or card donations
- 🛡️ **Anti-Scam Protection**: Report system with automatic banning for repeat offenders
- ⭐ **Best Sellers**: Featured best-selling cards
- 📊 **Price History**: Track price changes over time

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd soccer-card-seller
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- Database URL
- NextAuth secret
- OAuth provider credentials (Google, Clever, Instagram)
- eBay API credentials
- Stripe keys (for donations)

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses Prisma with SQLite. Key models include:
- User (with OAuth accounts, membership, moderation)
- Card (with brand, league, competition, type)
- Listing (active card listings)
- Trade (card trading system)
- Donation (money and card donations)
- Report (anti-scam moderation)
- PriceHistory (eBay price tracking)

## API Routes

- `/api/auth/*` - Authentication (NextAuth)
- `/api/membership` - Membership management
- `/api/listings` - Card listings
- `/api/trades` - Trading system
- `/api/donate` - Donations
- `/api/report` - User reporting
- `/api/ebay/update-prices` - eBay price updates (cron job)

## Features in Detail

### Search & Filters
- Search by player name, card name, or listing title
- Filter by brand, league/competition, and card type
- Real-time search results

### Membership
- Free membership required to sell cards
- Requires: name, email, phone number
- Members can create unlimited listings

### Trading
- Initiate trades with other users
- Delivery address and tracking number support
- Trade status tracking (pending, accepted, completed, etc.)

### Anti-Scam System
- Report users for suspicious activity
- Automatic banning after 5+ reports
- Manual review system for reports

### eBay Integration
- Daily price updates (configure as cron job)
- Price history tracking
- Real-time price comparison

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For production deployment, consider:
- Using PostgreSQL instead of SQLite
- Setting up proper OAuth redirect URLs
- Configuring cron jobs for eBay price updates
- Setting up Stripe for payment processing
- Adding proper error monitoring

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.


# ben-soccer-card-collection
