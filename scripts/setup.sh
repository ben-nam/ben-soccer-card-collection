#!/bin/bash

echo "Setting up Soccer Card Seller..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your credentials"
echo "2. Run 'npm run dev' to start the development server"

