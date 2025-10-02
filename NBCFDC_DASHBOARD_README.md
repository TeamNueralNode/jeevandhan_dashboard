# NBCFDC Credit Scoring Dashboard

## Problem Statement ID: 25150
**Beneficiary Credit Scoring with Income Verification Layer for Direct Digital Lending**

A comprehensive dashboard solution for the Ministry of Social Justice & Empowerment (MoSJE) to implement AI/ML-based credit scoring for NBCFDC beneficiaries with income verification through consumption patterns.

## 🎯 Objectives

- **Primary Goal**: Ensure loans reach genuine, low-income beneficiaries with good repayment behavior
- **Performance Target**: Reduce processing time for repeat borrowers by 50% or more  
- **Automation Goal**: Enable same-day sanction for high-score beneficiaries through direct digital lending

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Convex (serverless backend-as-a-service)
- **Authentication**: Role-based access control
- **Database**: Convex real-time database with automatic scaling
- **Deployment**: Docker containerization with multi-stage builds

### Core Components

#### 1. **Beneficiary Management System**
- Complete beneficiary profiles with KYC documents
- Demographic information and category classification (SC/ST/OBC)
- Channel partner integration for data collection
- Status management (active/inactive/suspended)

#### 2. **Credit Scoring Engine**
- **Repayment Score (60% weight)**: Based on historical payment behavior
  - On-time payment ratio
  - NPA history analysis
  - Average delay calculation
  - Repeat borrower bonus
- **Income Score (40% weight)**: Consumption-based income verification
  - Electricity usage patterns
  - Mobile recharge frequency and amounts
  - Utility bill payment patterns
  - Government socio-economic survey data
- **Composite Score**: Weighted combination with explainable factors

#### 3. **Risk Classification System**
Four-tier risk band classification:
- **Low Risk-High Need**: Ideal candidates for concessional lending
- **Low Risk-Low Need**: Eligible but lower priority
- **High Risk-High Need**: Requires manual review
- **High Risk-Low Need**: Typically rejected

#### 4. **Digital Lending Module**
- **Auto-Approval Logic**: 
  - Minimum score threshold: 70/100
  - Maximum auto-approval amount: ₹2,00,000
  - Approved purposes: business, education, skill development, equipment
- **Processing Time**: Target <60 seconds for auto-approved loans
- **Interest Rate Determination**: Risk-based pricing (4%-8%)
- **Manual Review Queue**: For complex cases requiring human intervention

#### 5. **Income Verification Layer**
Multiple data sources for comprehensive income assessment:
- **Electricity Consumption**: Usage patterns and bill amounts
- **Mobile Usage**: Recharge frequency and amounts (anonymized)
- **Utility Bills**: Water, gas, and other utility payments
- **Survey Data**: Government socio-economic datasets
- **Asset Information**: Household assets and ownership patterns

## 📊 Dashboard Features

### Overview Tab
- Key performance metrics and KPIs
- Risk band distribution visualization
- Recent loan applications status
- Auto-approval rate tracking

### Beneficiaries Tab
- Comprehensive beneficiary search and filtering
- Category-wise and state-wise distribution
- Status management and profile updates
- Bulk operations support

### Credit Scoring Tab
- Score distribution analytics
- Model performance metrics
- Batch score calculation
- Score history and trends

### Digital Lending Tab
- Application processing dashboard
- Auto-approval vs manual review metrics
- Processing time analytics
- Loan disbursement tracking

### Analytics Tab
- Advanced reporting and insights
- Trend analysis and forecasting
- Performance benchmarking
- Export capabilities

## 🤖 ML Model Features

### Transparent & Explainable AI
- **Model Explanation**: Each score includes factor-wise impact analysis
- **Audit Trail**: Complete scoring methodology documentation
- **Compliance Ready**: Transparent decision-making process
- **Periodic Re-scoring**: Automatic score updates as new data arrives

### Handling Missing Data
- **Graceful Degradation**: Model works with incomplete data
- **Default Scoring**: Neutral scores for new beneficiaries
- **Progressive Enhancement**: Scores improve as more data becomes available
- **Data Quality Indicators**: Confidence levels based on data completeness

### Model Versioning
- **Version Control**: Track model updates and improvements
- **A/B Testing**: Compare model performance across versions
- **Rollback Capability**: Revert to previous model versions if needed
- **Performance Monitoring**: Continuous model performance tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- Convex account and deployment URL
- Environment variables configured

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd jeevandhan_dashboard
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   ```

3. **Initialize Demo Data**
   - Start the development server: `npm run dev`
   - Visit the login page
   - Click "Initialize Demo Data" to populate sample beneficiaries, loans, and scores
   - Login with credentials: `admin` / `admin`

4. **Docker Deployment**
   ```bash
   docker-compose up --build
   ```

## 📈 Key Metrics & KPIs

### Performance Indicators
- **Processing Time Reduction**: Target 50%+ improvement
- **Auto-Approval Rate**: Aim for 60-70% for eligible applications
- **Same-Day Disbursement**: For scores >80 with complete documentation
- **Data Coverage**: Track consumption data availability across beneficiaries

### Risk Management
- **Default Rate Monitoring**: Track performance across risk bands
- **Income Verification Accuracy**: Validate consumption-based estimates
- **Model Drift Detection**: Monitor score distribution changes over time
- **Compliance Metrics**: Ensure transparent and auditable decisions

## 🔒 Security & Compliance

### Data Protection
- **Anonymized Data**: Personal identifiers removed from consumption data
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions for different user types
- **Audit Logging**: Complete activity tracking for compliance

### Regulatory Compliance
- **Transparent Scoring**: Explainable AI for regulatory requirements
- **Fair Lending**: Bias detection and mitigation in scoring models
- **Data Governance**: Proper data handling and retention policies
- **Privacy Protection**: GDPR-compliant data processing

## 🛠️ Technical Implementation

### Database Schema
- **Beneficiaries**: Complete profile and demographic information
- **Loans**: Loan lifecycle management with status tracking
- **Repayments**: Payment history with delay and penalty tracking
- **Consumption Data**: Multi-source income verification data
- **Credit Scores**: Versioned scores with explanation and validity
- **Digital Applications**: End-to-end application processing

### API Endpoints
- **Beneficiary Management**: CRUD operations with search and filtering
- **Credit Scoring**: Score calculation and retrieval with explanations
- **Digital Lending**: Application processing and approval workflows
- **Data Upload**: Bulk consumption data import with validation
- **Analytics**: Comprehensive reporting and insights

### Real-time Features
- **Live Dashboard Updates**: Real-time metrics and status updates
- **Instant Scoring**: On-demand credit score calculation
- **Application Tracking**: Live status updates for loan applications
- **Notification System**: Alerts for important events and thresholds

## 📋 Sample Data

The dashboard includes comprehensive sample data for demonstration:

### Sample Beneficiaries
- **Rajesh Kumar** (NBCFDC001): SC category, good payment history, business owner
- **Priya Sharma** (NBCFDC002): ST category, excellent payments, handicraft artisan  
- **Suresh Patel** (NBCFDC003): OBC category, new borrower, textile worker

### Sample Scenarios
- **Auto-Approval**: High-score beneficiary with complete data
- **Manual Review**: Large loan amount requiring human oversight
- **Income Verification**: Multiple consumption data sources for validation
- **Risk Assessment**: Different risk bands with appropriate interest rates

## 🔮 Future Enhancements

### Advanced ML Features
- **Deep Learning Models**: Enhanced pattern recognition in consumption data
- **Alternative Data Sources**: Social media, e-commerce, and digital footprint analysis
- **Predictive Analytics**: Early warning systems for potential defaults
- **Behavioral Scoring**: Transaction pattern analysis for risk assessment

### Integration Capabilities
- **Banking APIs**: Direct integration with partner banks for disbursement
- **Government Databases**: Real-time verification with official records
- **Credit Bureaus**: Integration with CIBIL and other credit agencies
- **Mobile Apps**: Beneficiary-facing mobile application for self-service

### Scalability Features
- **Multi-tenant Architecture**: Support for multiple NBFCs and states
- **API Gateway**: Standardized APIs for third-party integrations
- **Microservices**: Modular architecture for independent scaling
- **Cloud Native**: Full cloud deployment with auto-scaling capabilities

## 📞 Support & Documentation

### Technical Support
- **API Documentation**: Comprehensive API reference and examples
- **User Guides**: Step-by-step guides for different user roles
- **Video Tutorials**: Interactive training materials
- **Help Desk**: Technical support and troubleshooting assistance

### Training & Adoption
- **Administrator Training**: System configuration and management
- **Operator Training**: Daily operations and beneficiary management
- **Analyst Training**: Advanced analytics and reporting features
- **Change Management**: Smooth transition from existing systems

---

**Built for Ministry of Social Justice & Empowerment (MoSJE)**  
**Department: Samajik Nyay Aur Shashaktikaran Vibhag**  
**Category: Software - Smart Automation**

This dashboard represents a comprehensive solution for modernizing NBCFDC's lending operations while ensuring transparency, fairness, and efficiency in serving backward class beneficiaries across India.
