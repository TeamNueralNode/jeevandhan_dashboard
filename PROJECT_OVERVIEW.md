# 🏦 NBCFDC Credit Scoring Dashboard - Complete Project Overview

## 📌 Project Identity

**Project Name**: Jeevandhan Dashboard  
**Problem Statement ID**: 25150  
**Category**: Software - Smart Automation  
**Submitted To**: Ministry of Social Justice & Empowerment (MoSJE)  
**Department**: Samajik Nyay Aur Shashaktikaran Vibhag  
**Organization**: National Backward Classes Finance & Development Corporation (NBCFDC)

---

## 🎯 Mission & Objectives

### Primary Mission
Enable **fast, transparent, and fair digital lending** to backward class beneficiaries (SC/ST/OBC communities) through AI/ML-based credit scoring that considers alternative data sources for income verification.

### Key Objectives
1. **Speed**: Reduce loan processing time by 50% or more for repeat borrowers
2. **Transparency**: Provide explainable AI decisions for every credit score
3. **Inclusion**: Enable lending to beneficiaries without traditional credit history
4. **Automation**: Same-day sanction for high-score beneficiaries (>70/100)
5. **Fairness**: Use consumption patterns to verify income when traditional data is unavailable

---

## 🏗️ System Architecture

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 15.5.4 | Modern React framework with App Router |
| **UI Framework** | Tailwind CSS | 4.x | Utility-first styling |
| **Component Library** | Shadcn/ui | Latest | Pre-built accessible components |
| **Backend** | Convex | Latest | Serverless backend-as-a-service |
| **Database** | Convex DB | Latest | Real-time NoSQL database |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Icons** | Lucide React | 0.544.0 | Modern icon library |
| **Charts** | Recharts | 3.2.1 | Data visualization |
| **PDF Generation** | jsPDF | 3.0.3 | Report generation |
| **Authentication** | JWT + bcrypt | Latest | Secure role-based access |
| **Deployment** | Docker | Latest | Containerized deployment |

### Architecture Pattern
```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Dashboard  │  │ Analytics  │  │  Digital   │            │
│  │    UI      │  │   Charts   │  │  Lending   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         Next.js 15 + TypeScript + Tailwind CSS              │
└──────────────────────────────────────────────────────────────┘
                           ↕ Real-time API
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER (Convex)                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Queries   │  │ Mutations  │  │   Credit   │            │
│  │  (Read)    │  │  (Write)   │  │  Scoring   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│       Serverless Functions + Real-time Subscriptions         │
└──────────────────────────────────────────────────────────────┘
                           ↕ Database Operations
┌──────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Benefi-   │ │  Loans   │ │ Credit   │ │Consump-  │       │
│  │ciaries   │ │          │ │ Scores   │ │tion Data │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│           7 Tables with Real-time Sync & Indexes             │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema (7 Core Tables)

### 1. **roles** - Authentication & Authorization
- Manages user roles and permissions
- Uses bcrypt for password hashing
- Supports role-based access control (RBAC)
- Default roles: admin, loan_officer, analyst, channel_partner

### 2. **beneficiaries** - Borrower Profiles
- **Record Count**: 10 sample beneficiaries
- **Key Fields**: beneficiaryId, name, phoneNumber, address, demographicInfo, kycDocuments
- **Category Classification**: SC/ST/OBC/General
- **Status**: active, inactive, suspended
- **Indexes**: by_beneficiaryId, by_phoneNumber, by_channelPartner

### 3. **loans** - Loan Lifecycle Management
- **Record Count**: Multiple loans per beneficiary
- **Statuses**: applied → sanctioned → disbursed → closed/npa
- **Key Fields**: loanAmount, tenure, interestRate, purpose, sanctionDate
- **Loan Types**: business, education, housing, skill_development, equipment
- **Indexes**: by_beneficiaryId, by_loanId, by_status

### 4. **repayments** - Payment History
- **Tracks**: EMI schedules, payments, delays, penalties
- **Key Metrics**: On-time payments, average delay, NPA history
- **Status**: paid, overdue, partial, missed
- **Indexes**: by_loanId, by_beneficiaryId, by_dueDate

### 5. **consumptionData** - Income Verification
- **Data Types**: 
  - Electricity consumption & bills
  - Mobile recharge patterns
  - Utility bills (water, gas)
  - Government survey data
- **Verification Status**: pending, verified, rejected
- **Monthly Tracking**: Data organized by monthYear (YYYY-MM)
- **Indexes**: by_beneficiaryId, by_dataType, by_monthYear

### 6. **creditScores** - AI/ML Credit Scores
- **Score Range**: 0-100 (composite score)
- **Components**:
  - Repayment Score (60% weight): 0-100
  - Income Score (40% weight): 0-100
- **Risk Bands**:
  - Low Risk-High Need (Best candidates)
  - Low Risk-Low Need
  - High Risk-High Need (Manual review)
  - High Risk-Low Need (Typically rejected)
- **Validity**: 30 days from calculation
- **Explainability**: Each score includes factor-wise impact analysis
- **Indexes**: by_beneficiaryId, by_riskBand, by_compositeScore

### 7. **digitalLendingApplications** - Loan Applications
- **Auto-Approval Criteria**:
  - Composite score ≥ 70
  - Requested amount ≤ ₹2,00,000
  - Approved purposes: business, education, skill_development, equipment
- **Statuses**: auto_approved, manual_review, rejected, cancelled
- **Processing Time Target**: <60 seconds
- **Interest Rate Range**: 4%-8% (risk-based pricing)
- **Indexes**: by_beneficiaryId, by_approvalStatus, by_autoApprovalEligible

---

## 🤖 AI/ML Credit Scoring Engine

### Scoring Methodology

The credit scoring algorithm is a **transparent, explainable ML model** that combines two weighted components:

#### 1. Repayment Score (60% Weight)
**Base Score**: 50/100

**Factors**:
- ✅ **On-time Payment Ratio** (40% of weight)
  - Formula: `(onTimePayments / totalPayments - 0.5) × 80`
  - Range: -40 to +40 points
  
- ❌ **NPA Penalty** (30% of weight)
  - Penalty: Up to -30 points for non-performing assets
  - Formula: `min(npaLoans × 15, 30)`
  
- ⏱️ **Average Delay Penalty** (20% of weight)
  - Penalty: Up to -20 points based on delay days
  - Formula: `min(averageDelay / 2, 20)`
  
- 🔄 **Repeat Borrower Bonus** (10% of weight)
  - Bonus: +10 points for proven borrowers

**Example Calculation**:
```
Beneficiary: 10/10 on-time payments, no NPA, 1.2 days avg delay
Repayment Score = 50 + 40 + 0 - 0.6 + 10 = 99.4/100
```

#### 2. Income Score (40% Weight)
**Base Score**: 50/100

**Factors**:
- 💰 **Income-based Need Assessment**
  - Very low income (<₹15,000): +20 points
  - Low income (₹15,000-₹25,000): +10 points
  - High income (>₹50,000): -20 points
  
- 📊 **Data Stability Bonus**
  - Formula: `incomeStability × 20`
  - Range: 0 to +20 points
  
- 📁 **Data Availability Bonus**
  - Formula: `min(consumptionData.length × 2, 10)`
  - Range: 0 to +10 points

**Income Estimation Methods**:
- **Electricity**: `estimatedIncome = avgElectricityBill × 25`
- **Mobile Recharges**: `estimatedIncome = avgMonthlyMobile × 60`
- **Survey Data**: Direct household income reporting
- **Consumption Pattern**: Low/Medium/High classification

#### 3. Composite Score (Final Score)
```
Composite Score = (Repayment Score × 0.6) + (Income Score × 0.4)
```

#### 4. Risk Band Classification
- **Composite Score ≥ 70** → Low Risk
- **Estimated Income < ₹25,000** → High Need
- **Risk Band Matrix**:
  - Low Risk + High Need = **Low Risk-High Need** (Priority lending)
  - Low Risk + Low Need = **Low Risk-Low Need** (Eligible)
  - High Risk + High Need = **High Risk-High Need** (Manual review)
  - High Risk + Low Need = **High Risk-Low Need** (Reject)

### Explainability Features
Every credit score includes:
- **Factor-wise breakdown**: Which factors increased/decreased the score
- **Impact values**: -100 to +100 for each factor
- **Human-readable descriptions**: Plain language explanations
- **Model version tracking**: For audit and compliance

**Example Explanation**:
```json
{
  "factor": "On-time Payment Ratio",
  "impact": 18,
  "description": "10/10 payments made on time"
}
```

---

## 📱 Dashboard Features & User Interfaces

### 1. Login & Authentication
**File**: `app/login/page.tsx`

**Features**:
- Role-based login (admin, loan_officer, analyst, channel_partner)
- Demo data initialization button
- Quick-fill admin credentials for testing
- Secure JWT-based authentication

**Demo Credentials**:
- **Admin**: admin / admin123
- **Loan Officer**: loan_officer / officer123
- **Analyst**: analyst / analyst123
- **Channel Partner**: channel_partner / partner123

### 2. Dashboard Overview
**File**: `app/dashboard/page.tsx`

**Six Main Tabs**:

#### Tab 1: Overview
- **Key Metrics**:
  - Total beneficiaries count
  - Active loans count
  - Total loan amount disbursed
  - Auto-approval rate
- **Visualizations**:
  - Risk band distribution (pie chart)
  - Loan status breakdown
  - Processing time trends
  - Category distribution (SC/ST/OBC)

#### Tab 2: Beneficiaries
- **Features**:
  - Search by ID, name, or phone
  - Filter by status, category, channel partner
  - Detailed beneficiary profiles
  - Linked loans and credit scores
  - Consumption data history
- **Actions**:
  - View full profile
  - Update status
  - Add new beneficiary
  - Calculate credit score

#### Tab 3: Credit Scoring
- **Features**:
  - Score distribution histogram
  - Risk band analysis
  - Model performance metrics
  - Factor importance visualization
- **Actions**:
  - Calculate individual scores
  - Batch score calculation
  - View score history
  - Export score reports

#### Tab 4: Digital Lending
- **Features**:
  - Application pipeline view
  - Auto-approval vs manual review metrics
  - Processing time analytics
  - Approval/rejection reasons
- **Actions**:
  - Process new applications
  - Review pending applications
  - Approve/reject manually
  - Track application status

#### Tab 5: Data Upload
- **Features**:
  - CSV/Excel file upload
  - Consumption data import
  - Data validation and preview
  - Bulk upload progress tracking
- **Supported Data Types**:
  - Electricity bills
  - Mobile recharges
  - Utility bills
  - Survey data

#### Tab 6: Analytics
- **Features**:
  - Advanced reporting
  - Trend analysis
  - Comparative analytics
  - Export capabilities (PDF, CSV)
- **Reports**:
  - Loan portfolio analysis
  - Default rate tracking
  - Income verification accuracy
  - Channel partner performance

### 3. Explainability Dashboard
**File**: `app/explainability/page.tsx`

**Features**:
- Interactive credit score explanations
- Factor impact visualizations
- Model transparency documentation
- Audit trail for compliance

---

## 🔄 Business Process Workflows

### Workflow 1: New Beneficiary Onboarding
```
1. Register beneficiary → 2. Collect KYC → 3. Upload consumption data
→ 4. Calculate initial credit score → 5. Set status to active
```

### Workflow 2: Credit Score Calculation
```
1. Fetch beneficiary profile → 2. Collect loan history → 3. Collect repayment data
→ 4. Collect consumption data → 5. Calculate repayment score → 6. Calculate income score
→ 7. Generate composite score → 8. Assign risk band → 9. Create explanations
→ 10. Store score record (valid for 30 days)
```

### Workflow 3: Digital Lending Application
```
1. Beneficiary applies for loan → 2. Fetch latest credit score (or calculate if expired)
→ 3. Check auto-approval eligibility:
   - Score ≥ 70?
   - Amount ≤ ₹2,00,000?
   - Approved purpose?
→ 4a. Auto-approved: Generate loan record, set interest rate, notify beneficiary
→ 4b. Manual review: Queue for officer review
→ 5. Track processing time → 6. Update application status
```

### Workflow 4: Manual Review
```
1. Loan officer views pending applications → 2. Review credit score and explanations
→ 3. Review consumption data and income verification → 4. Check loan history
→ 5. Make decision: approve/reject → 6. Set terms (amount, tenure, rate)
→ 7. Add conditions/notes → 8. Update application status
```

---

## 📁 Project Structure

```
jeevandhan_dashboard/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Main dashboard page
│   │   └── page.tsx             # 6-tab dashboard interface
│   ├── login/                    # Authentication
│   │   └── page.tsx             # Login page with demo data init
│   ├── upload/                   # Data upload interface
│   │   └── page.tsx             # CSV/Excel upload for consumption data
│   ├── explainability/           # AI explainability
│   │   └── page.tsx             # Score explanation dashboard
│   ├── components/               # Shared components
│   │   └── providers.tsx        # Context providers
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ... (20+ components)
│   ├── DashboardHeader.tsx      # Dashboard header
│   ├── Sidebar.tsx              # Navigation sidebar
│   └── ... (chart components)
│
├── convex/                       # Backend serverless functions
│   ├── schema.ts                # Database schema definition
│   ├── auth.ts                  # Authentication logic
│   ├── beneficiaries.ts         # Beneficiary CRUD operations
│   ├── creditScoring.ts         # Credit scoring algorithm
│   ├── digitalLending.ts        # Loan application processing
│   ├── consumptionData.ts       # Income verification data
│   ├── consumptionUpload.ts     # Bulk data upload
│   ├── roles.ts                 # Role management
│   ├── initializeData.ts        # Complete demo data (10 beneficiaries)
│   ├── initializeDemo.ts        # Quick demo data (3 beneficiaries)
│   ├── sampleData.ts            # Sample data utilities
│   ├── debug.ts                 # Debug utilities
│   ├── init.ts                  # Initial setup
│   ├── util.ts                  # Helper functions
│   ├── _generated/              # Convex generated files
│   └── README.md                # Convex setup guide
│
├── lib/                          # Utility libraries
│   ├── auth.ts                  # Auth context and hooks
│   └── utils.ts                 # Helper functions
│
├── public/                       # Static assets
│   └── ... (images, icons)
│
├── NBCFDC_DASHBOARD_README.md   # Main project documentation
├── TECHNICAL_DOCUMENTATION.md    # Technical deep dive
├── CONVEX_SETUP.md              # Backend setup guide
├── DOCKER.md                    # Docker deployment guide
├── README.md                    # Basic Next.js readme
├── Dockerfile                   # Container configuration
├── docker-compose.yml           # Docker Compose setup
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── components.json              # Shadcn/ui configuration
└── .gitignore                   # Git ignore rules
```

---

## 🚀 Getting Started Guide

### Prerequisites
- **Node.js**: Version 20 or higher
- **npm**: Latest version
- **Convex Account**: Free account at convex.dev
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Quick Start (5 Minutes)

#### Step 1: Clone Repository
```bash
git clone https://github.com/TeamNueralNode/jeevandhan_dashboard.git
cd jeevandhan_dashboard
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Setup Convex Backend
```bash
# Login to Convex
npx convex dev

# Follow prompts to:
# 1. Create/select project
# 2. Get deployment URL
# 3. Setup environment
```

#### Step 4: Configure Environment
```bash
# Create .env.local file
echo "NEXT_PUBLIC_CONVEX_URL=your_deployment_url" > .env.local
```

#### Step 5: Start Development Server
```bash
npm run dev
```

#### Step 6: Initialize Demo Data
1. Open browser: http://localhost:3000
2. Navigate to login page
3. Click "Initialize Demo Data" button
4. Wait for confirmation
5. Login with: `admin` / `admin123`

### Docker Deployment

#### Build and Run
```bash
docker-compose up --build
```

#### Access Application
- Application: http://localhost:3000
- Convex Dashboard: https://dashboard.convex.dev

---

## 📊 Sample Data Overview

### 10 Demo Beneficiaries Included

| ID | Name | Category | Occupation | State | Score |
|----|------|----------|------------|-------|-------|
| NBCFDC001 | Rajesh Kumar | SC | Small Business | Rajasthan | 79 |
| NBCFDC002 | Priya Sharma | ST | Handicraft | MP | 92 |
| NBCFDC003 | Suresh Patel | OBC | Textile | Gujarat | 68 |
| NBCFDC004 | Lakshmi Devi | SC | Weaving | Tamil Nadu | 75 |
| NBCFDC005 | Arun Singh | ST | Farming | Jharkhand | 82 |
| NBCFDC006 | Ravi Kumar | SC | Pottery | Bihar | 70 |
| NBCFDC007 | Anil Verma | General | Carpentry | MP | 65 |
| NBCFDC008 | Sunita Yadav | OBC | Tailoring | UP | 88 |
| NBCFDC009 | Mohan Reddy | SC | Electronics | Karnataka | 79 |
| NBCFDC010 | Rekha Devi | ST | Weaving | Tamil Nadu | 85 |

### Sample Loan Applications
- **Auto-approved**: 3 applications (scores >70, amounts <₹2L)
- **Manual review**: 2 applications (large amounts or new borrowers)
- **Processing time**: Average 45-90 seconds

### Consumption Data
- **Electricity bills**: 12 months per beneficiary
- **Mobile recharges**: 6-12 months of data
- **Survey data**: Household income and assets
- **Verification status**: Mix of verified/pending

---

## 🎨 UI Components & Design System

### Component Library: Shadcn/ui
Pre-built, accessible components including:
- **Forms**: Input, Select, Checkbox, Radio, Textarea
- **Data Display**: Table, Card, Badge, Avatar, Progress
- **Feedback**: Alert, Toast, Dialog, Tooltip
- **Navigation**: Tabs, Dropdown, Sidebar
- **Charts**: Line, Bar, Pie, Area (via Recharts)

### Design Tokens
- **Colors**: 
  - Primary: Blue (#3B82F6)
  - Secondary: Purple (#8B5CF6)
  - Success: Green (#10B981)
  - Warning: Yellow (#F59E0B)
  - Danger: Red (#EF4444)
- **Typography**: Geist Sans font family
- **Spacing**: Tailwind's 4px base scale
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

### Responsive Design
- **Mobile-first**: All interfaces optimized for mobile
- **Tablet support**: Adapted layouts for medium screens
- **Desktop**: Full-featured experience with sidebars

---

## 🔒 Security & Compliance

### Authentication & Authorization
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Role-Based Access Control**: 4 role types with specific permissions
- **Session Expiry**: Configurable timeout

### Data Protection
- **Encryption**: All data encrypted in transit (HTTPS)
- **Anonymization**: Personal identifiers removed from analytics
- **Access Logging**: Complete audit trail
- **Data Retention**: Configurable retention policies

### Compliance Features
- **Explainable AI**: Every decision includes reasoning
- **Audit Trail**: Complete history of all actions
- **Data Governance**: Proper data handling procedures
- **Fair Lending**: Bias detection and mitigation
- **GDPR Ready**: Privacy protection mechanisms

---

## 📈 Performance Metrics & KPIs

### Operational Metrics
- **Processing Time**: <60 seconds for auto-approval (Target: 50% reduction)
- **Auto-Approval Rate**: 60-70% of eligible applications
- **Same-Day Disbursement**: For scores >80 with complete documentation
- **Data Coverage**: Track consumption data availability

### Risk Metrics
- **Default Rate**: Track by risk band
- **Income Verification Accuracy**: Validate consumption-based estimates
- **Model Drift**: Monitor score distribution changes
- **NPA Rate**: Track non-performing assets

### Business Metrics
- **Loan Disbursement Volume**: Total amount and count
- **Beneficiary Satisfaction**: Survey-based feedback
- **Channel Partner Performance**: Application quality and volume
- **System Uptime**: 99.9% availability target

---

## 🔮 Future Roadmap

### Phase 1: Enhanced ML (Q2 2025)
- Deep learning models for pattern recognition
- Predictive default probability models
- Behavioral scoring based on transaction patterns
- Real-time score updates

### Phase 2: Integration (Q3 2025)
- Banking API integration for disbursement
- Government database verification (Aadhaar, PAN)
- Credit bureau integration (CIBIL)
- SMS/Email notification system

### Phase 3: Mobile App (Q4 2025)
- Beneficiary-facing mobile application
- Self-service loan applications
- Document upload from mobile
- Real-time application tracking

### Phase 4: Advanced Analytics (Q1 2026)
- Predictive analytics dashboard
- Early warning systems
- Portfolio optimization
- Market trend analysis

### Phase 5: Scale (Q2 2026)
- Multi-tenant architecture
- State-level customization
- API gateway for third-parties
- Microservices architecture

---

## 🛠️ Development & Deployment

### Development Workflow
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional
NODE_ENV=development
PORT=3000
```

### Convex Deployment
```bash
# Deploy Convex backend
npx convex deploy

# Run Convex functions locally
npx convex dev
```

### Docker Deployment
```bash
# Build image
docker build -t jeevandhan-dashboard .

# Run container
docker run -p 3000:3000 jeevandhan-dashboard

# Or use docker-compose
docker-compose up -d
```

---

## 📚 Additional Resources

### Documentation Files
- **NBCFDC_DASHBOARD_README.md**: High-level overview and features
- **TECHNICAL_DOCUMENTATION.md**: Deep technical details (28KB)
- **CONVEX_SETUP.md**: Backend setup instructions
- **DOCKER.md**: Containerization guide
- **convex/README.md**: Convex-specific documentation

### External Links
- **Convex Documentation**: https://docs.convex.dev
- **Next.js Documentation**: https://nextjs.org/docs
- **Shadcn/ui Components**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs

### Support Channels
- **GitHub Issues**: Report bugs and request features
- **Technical Support**: For deployment and configuration help
- **User Training**: Video tutorials and guides

---

## 👥 Stakeholders & Users

### Primary Users
1. **NBCFDC Loan Officers**: Process applications, review cases
2. **Credit Analysts**: Monitor performance, generate reports
3. **System Administrators**: Manage users, configure system
4. **Channel Partners**: Submit beneficiary data

### Secondary Users
1. **Beneficiaries**: Receive loans, track applications (future mobile app)
2. **Management**: View dashboards, make policy decisions
3. **Auditors**: Review audit trails, ensure compliance

### Key Stakeholders
- **Ministry of Social Justice & Empowerment**: Policy oversight
- **NBCFDC Management**: Operational decisions
- **State Cooperative Banks**: Channel partner network
- **Beneficiary Communities**: SC/ST/OBC beneficiaries across India

---

## 🎖️ Key Differentiators

### Why This Solution Stands Out

1. **Alternative Data Sources**: Uses consumption patterns instead of traditional credit scores
2. **Explainable AI**: Every decision is transparent and auditable
3. **Speed**: 50%+ faster processing for repeat borrowers
4. **Inclusion**: Serves beneficiaries without banking history
5. **Real-time**: Live dashboards and instant score calculation
6. **Scalable**: Serverless architecture handles growth automatically
7. **Modern Stack**: Latest technologies for best performance
8. **Mobile-ready**: Responsive design, future mobile app planned

---

## 📞 Contact & Support

**Project Repository**: https://github.com/TeamNueralNode/jeevandhan_dashboard  
**Organization**: TeamNueralNode  
**Project**: Jeevandhan Dashboard  
**Problem Statement**: 25150 - Beneficiary Credit Scoring with Income Verification

---

**Built with ❤️ for inclusive financial access**  
**Empowering backward class communities through transparent, fair, and fast digital lending**

---

*Last Updated: January 2025*  
*Version: 1.0*  
*License: To be determined by Ministry of Social Justice & Empowerment*
