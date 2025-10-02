#!/bin/bash

echo "🚀 NBCFDC Dashboard - Convex Setup Script"
echo "=========================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Convex Configuration for NBCFDC Dashboard
# Replace with your actual Convex deployment URL from https://dashboard.convex.dev
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud

# Example format:
# NEXT_PUBLIC_CONVEX_URL=https://happy-animal-123.convex.cloud
EOF
    echo "✅ Created .env.local template"
    echo "⚠️  Please edit .env.local with your actual Convex deployment URL"
else
    echo "✅ .env.local already exists"
fi

# Check if Convex CLI is installed
if ! command -v convex &> /dev/null; then
    echo "📦 Installing Convex CLI..."
    npm install -g convex
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Visit https://dashboard.convex.dev to create a project"
echo "2. Copy your deployment URL (e.g., https://happy-animal-123.convex.cloud)"
echo "3. Edit .env.local and replace 'your-deployment-url' with your actual URL"
echo "4. Run: npx convex dev"
echo "5. Run: npm run dev"
echo "6. Visit http://localhost:3000 and click 'Initialize Demo Data'"
echo ""
echo "📚 For detailed instructions, see CONVEX_SETUP.md"
