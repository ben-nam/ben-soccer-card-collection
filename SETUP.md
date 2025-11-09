# Setup Guide for Soccer Card Seller

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - SQLite database path (default: `file:./dev.db`)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
   - OAuth credentials (Google, Clever, Instagram)
   - eBay API credentials
   - Stripe keys (for donations)

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Clever OAuth
Clever requires custom OAuth implementation. You'll need to:
1. Register your app with Clever
2. Implement a custom NextAuth provider
3. Add credentials to `.env`

### Instagram OAuth
Instagram OAuth requires:
1. Facebook Developer account
2. Create Instagram app
3. Implement custom NextAuth provider
4. Add credentials to `.env`

## eBay API Setup

1. Register at [eBay Developers Program](https://developer.ebay.com/)
2. Create an app and get:
   - App ID
   - Cert ID
   - Dev ID
3. Add credentials to `.env`
4. Set up cron job for daily price updates:
   ```bash
   # Add to crontab (runs daily at 2 AM)
   0 2 * * * curl -X POST http://your-domain.com/api/ebay/update-prices -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

## Stripe Setup (for Donations)

1. Create account at [Stripe](https://stripe.com/)
2. Get API keys from dashboard
3. Add to `.env`:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Database Management

- View database: `npm run db:studio`
- Create migration: `npm run db:migrate`
- Generate Prisma client: `npm run db:generate`

## Production Deployment

1. Use PostgreSQL instead of SQLite
2. Update `DATABASE_URL` in production environment
3. Set up proper OAuth redirect URLs
4. Configure cron jobs for eBay updates
5. Set up error monitoring (e.g., Sentry)
6. Enable HTTPS
7. Set secure cookies and environment variables

## Troubleshooting

### Database Issues
- Delete `prisma/dev.db` and run migrations again
- Check Prisma schema for errors

### OAuth Issues
- Verify redirect URIs match exactly
- Check environment variables are set correctly
- Ensure OAuth apps are configured properly

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

