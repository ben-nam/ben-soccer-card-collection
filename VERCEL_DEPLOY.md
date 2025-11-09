# Vercel Deployment Guide

## Important Notes

⚠️ **Database Configuration**: SQLite won't work on Vercel. You need to use a cloud database:
- **Recommended**: PostgreSQL (via Vercel Postgres, Supabase, or Neon)
- Update `DATABASE_URL` in Vercel environment variables

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository: `ben-nam/ben-soccer-card-collection`
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && prisma migrate deploy && next build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

5. **Add Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLEVER_CLIENT_ID=your-clever-client-id
   CLEVER_CLIENT_SECRET=your-clever-client-secret
   INSTAGRAM_CLIENT_ID=your-instagram-client-id
   INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
   EBAY_APP_ID=your-ebay-app-id
   EBAY_CERT_ID=your-ebay-cert-id
   EBAY_DEV_ID=your-ebay-dev-id
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
npx vercel
```

Follow the prompts to:
- Link to your Vercel account
- Select your project
- Set up environment variables

### Option 3: Deploy via GitHub Integration

1. Connect your GitHub account to Vercel
2. Vercel will automatically detect pushes to `main` branch
3. Each push will trigger a new deployment

## Database Migration

After deploying, run migrations:

```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's Postgres integration which handles migrations automatically.

## Post-Deployment Checklist

- [ ] Update database to PostgreSQL
- [ ] Set all environment variables in Vercel
- [ ] Update OAuth redirect URIs to your Vercel domain
- [ ] Test authentication flow
- [ ] Set up custom domain (optional)
- [ ] Configure cron jobs for eBay price updates (use Vercel Cron)

## Vercel Cron Jobs

For daily eBay price updates, add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/ebay/update-prices",
    "schedule": "0 2 * * *"
  }]
}
```

## Troubleshooting

- **Build fails**: Check that all environment variables are set
- **Database errors**: Ensure PostgreSQL connection string is correct
- **OAuth errors**: Verify redirect URIs match your Vercel domain

