# Convex Setup Guide for NBCFDC Dashboard

## Quick Setup Steps

### 1. Create Convex Account & Project

1. **Visit Convex Dashboard**: Go to https://dashboard.convex.dev
2. **Sign up/Login**: Create account or login with GitHub/Google
3. **Create New Project**: Click "Create a project" and name it "nbcfdc-dashboard"

### 2. Get Your Deployment URL

After creating the project, you'll see a deployment URL like:
```
https://happy-animal-123.convex.cloud
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root with:

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-actual-deployment-url.convex.cloud
```

**Replace `your-actual-deployment-url` with your real Convex URL!**

### 4. Deploy Convex Functions

Run these commands in your terminal:

```bash
# Install Convex CLI globally (if not already installed)
npm install -g convex

# Login to Convex
npx convex login

# Deploy your functions
npx convex dev
```

### 5. Initialize Sample Data

Once the server is running:

1. Visit http://localhost:3000
2. Click "Initialize Demo Data" button
3. Login with: `admin` / `admin`
4. Explore the dashboard!

## Alternative: Local Development Mode

If you want to test without Convex cloud, you can use local mode:

```bash
# Start local Convex backend
npx convex dev --run-local

# In another terminal, start Next.js
npm run dev
```

## Troubleshooting

### Error: "Configuration required"
- Make sure `.env.local` exists with correct `NEXT_PUBLIC_CONVEX_URL`
- Restart the dev server after adding environment variables

### Error: "Cannot find module 'convex/values'"
- Run `npm install` to ensure all dependencies are installed
- Make sure you're in the project directory

### Error: "Deployment not found"
- Check your Convex deployment URL is correct
- Make sure you've deployed functions with `npx convex dev`

## What's Included

The dashboard includes:

✅ **Complete Schema**: Beneficiaries, loans, repayments, credit scores
✅ **Sample Data**: 3 beneficiaries with realistic loan history  
✅ **Credit Scoring**: AI/ML algorithm with explainable factors
✅ **Digital Lending**: Auto-approval workflow
✅ **Analytics**: Real-time dashboard with metrics
✅ **Income Verification**: Consumption-based assessment

## Next Steps

1. **Set up Convex** (follow steps above)
2. **Initialize demo data** (one-click button)
3. **Explore features** (5 main dashboard sections)
4. **Customize** (add your own beneficiaries and data)

---

**Need Help?** 
- Convex Docs: https://docs.convex.dev
- Dashboard Features: See NBCFDC_DASHBOARD_README.md
