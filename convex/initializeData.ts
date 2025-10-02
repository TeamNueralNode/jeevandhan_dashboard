import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Initialize complete sample data for the dashboard
export const initializeCompleteData = mutation({
  args: { forceReset: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // First, ensure admin role exists
    const existingAdmin = await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("roleId"), "admin"))
      .first();
    
    if (!existingAdmin) {
      await ctx.db.insert("roles", {
        roleId: "admin",
        password: "admin",
        roleName: "Administrator",
        permissions: ["all"],
        createdAt: now,
        updatedAt: now,
      });
    }
    
    // Check if we already have sample data
    const existingBeneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), "NBCFDC001"))
      .first();
    
    if (existingBeneficiary && !args.forceReset) {
      // Count existing data to return accurate counts
      const beneficiaries = await ctx.db.query("beneficiaries").collect();
      const applications = await ctx.db.query("digitalLendingApplications").collect();
      const creditScores = await ctx.db.query("creditScores").collect();
      const loans = await ctx.db.query("loans").collect();
      const repayments = await ctx.db.query("repayments").collect();
      const consumptionData = await ctx.db.query("consumptionData").collect();
      
      return { 
        success: true, 
        message: "Sample data already exists",
        counts: {
          beneficiaries: beneficiaries.length,
          loans: loans.length,
          repayments: repayments.length,
          consumptionData: consumptionData.length,
          creditScores: creditScores.length,
          applications: applications.length,
        },
      };
    }
    
    // If force reset, clear existing data
    if (args.forceReset && existingBeneficiary) {
      console.log("Force reset requested, clearing existing data...");
      
      // Delete in reverse dependency order
      const applications = await ctx.db.query("digitalLendingApplications").collect();
      for (const app of applications) {
        await ctx.db.delete(app._id);
      }
      
      const creditScores = await ctx.db.query("creditScores").collect();
      for (const score of creditScores) {
        await ctx.db.delete(score._id);
      }
      
      const repayments = await ctx.db.query("repayments").collect();
      for (const repayment of repayments) {
        await ctx.db.delete(repayment._id);
      }
      
      const loans = await ctx.db.query("loans").collect();
      for (const loan of loans) {
        await ctx.db.delete(loan._id);
      }
      
      const consumptionData = await ctx.db.query("consumptionData").collect();
      for (const data of consumptionData) {
        await ctx.db.delete(data._id);
      }
      
      const beneficiaries = await ctx.db.query("beneficiaries").collect();
      for (const beneficiary of beneficiaries) {
        await ctx.db.delete(beneficiary._id);
      }
    }
    
    // Create comprehensive sample beneficiaries
    const beneficiaries = [
      {
        beneficiaryId: "NBCFDC001",
        name: "Rajesh Kumar",
        phoneNumber: "+91-9876543210",
        address: {
          street: "123 Gandhi Nagar",
          city: "Jaipur",
          state: "Rajasthan",
          pincode: "302001",
        },
        demographicInfo: {
          age: 35,
          gender: "Male",
          category: "SC",
          familySize: 4,
          occupation: "Small Business Owner",
        },
        kycDocuments: {
          aadhaar: "1234-5678-9012",
          pan: "ABCDE1234F",
          bankAccount: "1234567890",
        },
        channelPartner: "Rajasthan State Cooperative Bank",
        registrationDate: now - (365 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC002",
        name: "Priya Sharma",
        phoneNumber: "+91-9876543211",
        address: {
          street: "456 Nehru Colony",
          city: "Indore",
          state: "Madhya Pradesh",
          pincode: "452001",
        },
        demographicInfo: {
          age: 28,
          gender: "Female",
          category: "ST",
          familySize: 3,
          occupation: "Handicraft Artisan",
        },
        kycDocuments: {
          aadhaar: "2345-6789-0123",
          pan: "BCDEF2345G",
          bankAccount: "2345678901",
        },
        channelPartner: "MP State Financial Corporation",
        registrationDate: now - (200 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC003",
        name: "Suresh Patel",
        phoneNumber: "+91-9876543212",
        address: {
          street: "789 Ambedkar Road",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380001",
        },
        demographicInfo: {
          age: 42,
          gender: "Male",
          category: "OBC",
          familySize: 5,
          occupation: "Textile Worker",
        },
        kycDocuments: {
          aadhaar: "3456-7890-1234",
          pan: "CDEFG3456H",
          bankAccount: "3456789012",
        },
        channelPartner: "Gujarat State Cooperative Bank",
        registrationDate: now - (150 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      // Additional beneficiaries for more realistic data
      {
        beneficiaryId: "NBCFDC004",
        name: "Meera Devi",
        phoneNumber: "+91-9876543213",
        address: {
          street: "12 Shivaji Nagar",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        demographicInfo: {
          age: 31,
          gender: "Female",
          category: "SC",
          familySize: 2,
          occupation: "Tailoring",
        },
        kycDocuments: {
          aadhaar: "4567-8901-2345",
          pan: "DEFGH4567I",
          bankAccount: "4567890123",
        },
        channelPartner: "Maharashtra State Cooperative Bank",
        registrationDate: now - (120 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC005",
        name: "Ramesh Singh",
        phoneNumber: "+91-9876543214",
        address: {
          street: "67 Lal Bahadur Colony",
          city: "Lucknow",
          state: "Uttar Pradesh",
          pincode: "226001",
        },
        demographicInfo: {
          age: 39,
          gender: "Male",
          category: "OBC",
          familySize: 6,
          occupation: "Agriculture",
        },
        kycDocuments: {
          aadhaar: "5678-9012-3456",
          pan: "EFGHI5678J",
          bankAccount: "5678901234",
        },
        channelPartner: "UP State Financial Corporation",
        registrationDate: now - (90 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC006",
        name: "Kavita Kumari",
        phoneNumber: "+91-9876543215",
        address: {
          street: "89 Buddha Nagar",
          city: "Patna",
          state: "Bihar",
          pincode: "800001",
        },
        demographicInfo: {
          age: 26,
          gender: "Female",
          category: "ST",
          familySize: 4,
          occupation: "Pottery",
        },
        kycDocuments: {
          aadhaar: "6789-0123-4567",
          pan: "FGHIJ6789K",
          bankAccount: "6789012345",
        },
        channelPartner: "Bihar State Cooperative Bank",
        registrationDate: now - (60 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC007",
        name: "Anil Verma",
        phoneNumber: "+91-9876543216",
        address: {
          street: "34 Tilak Road",
          city: "Bhopal",
          state: "Madhya Pradesh",
          pincode: "462001",
        },
        demographicInfo: {
          age: 44,
          gender: "Male",
          category: "General",
          familySize: 3,
          occupation: "Carpentry",
        },
        kycDocuments: {
          aadhaar: "7890-1234-5678",
          pan: "GHIJK7890L",
          bankAccount: "7890123456",
        },
        channelPartner: "MP State Financial Corporation",
        registrationDate: now - (45 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC008",
        name: "Sunita Yadav",
        phoneNumber: "+91-9876543217",
        address: {
          street: "56 Nehru Park",
          city: "Kanpur",
          state: "Uttar Pradesh",
          pincode: "208001",
        },
        demographicInfo: {
          age: 33,
          gender: "Female",
          category: "OBC",
          familySize: 5,
          occupation: "Food Processing",
        },
        kycDocuments: {
          aadhaar: "8901-2345-6789",
          pan: "HIJKL8901M",
          bankAccount: "8901234567",
        },
        channelPartner: "UP State Financial Corporation",
        registrationDate: now - (30 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC009",
        name: "Deepak Gupta",
        phoneNumber: "+91-9876543218",
        address: {
          street: "78 MG Road",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
        demographicInfo: {
          age: 37,
          gender: "Male",
          category: "SC",
          familySize: 4,
          occupation: "Electronics Repair",
        },
        kycDocuments: {
          aadhaar: "9012-3456-7890",
          pan: "IJKLM9012N",
          bankAccount: "9012345678",
        },
        channelPartner: "Karnataka State Cooperative Bank",
        registrationDate: now - (15 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        beneficiaryId: "NBCFDC010",
        name: "Rekha Devi",
        phoneNumber: "+91-9876543219",
        address: {
          street: "90 Gandhi Road",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001",
        },
        demographicInfo: {
          age: 29,
          gender: "Female",
          category: "ST",
          familySize: 3,
          occupation: "Weaving",
        },
        kycDocuments: {
          aadhaar: "0123-4567-8901",
          pan: "JKLMN0123O",
          bankAccount: "0123456789",
        },
        channelPartner: "Tamil Nadu State Cooperative Bank",
        registrationDate: now - (7 * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Insert beneficiaries
    for (const beneficiary of beneficiaries) {
      await ctx.db.insert("beneficiaries", beneficiary);
    }
    
    // Create sample loans
    const loans = [
      {
        loanId: "LOAN001",
        beneficiaryId: "NBCFDC001",
        loanAmount: 150000,
        loanTenure: 36,
        interestRate: 6.0,
        purpose: "business",
        sanctionDate: now - (300 * 24 * 60 * 60 * 1000),
        disbursementDate: now - (295 * 24 * 60 * 60 * 1000),
        maturityDate: now + (65 * 24 * 60 * 60 * 1000),
        status: "disbursed",
        loanType: "business",
        channelPartner: "Rajasthan State Cooperative Bank",
        approvedBy: "ADMIN001",
        createdAt: now,
        updatedAt: now,
      },
      {
        loanId: "LOAN002",
        beneficiaryId: "NBCFDC002",
        loanAmount: 75000,
        loanTenure: 24,
        interestRate: 4.0,
        purpose: "skill_development",
        sanctionDate: now - (180 * 24 * 60 * 60 * 1000),
        disbursementDate: now - (175 * 24 * 60 * 60 * 1000),
        maturityDate: now + (545 * 24 * 60 * 60 * 1000),
        status: "disbursed",
        loanType: "education",
        channelPartner: "MP State Financial Corporation",
        approvedBy: "ADMIN001",
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    for (const loan of loans) {
      await ctx.db.insert("loans", loan);
    }
    
    // Create sample repayments
    const repayments = [];
    
    // Rajesh Kumar - Good payment history
    for (let i = 0; i < 10; i++) {
      repayments.push({
        repaymentId: `REP001_${i + 1}`,
        loanId: "LOAN001",
        beneficiaryId: "NBCFDC001",
        emiAmount: 4500,
        paidAmount: 4500,
        dueDate: now - ((10 - i) * 30 * 24 * 60 * 60 * 1000),
        paidDate: now - ((10 - i) * 30 * 24 * 60 * 60 * 1000) + (Math.random() * 3 * 24 * 60 * 60 * 1000),
        status: "paid",
        paymentMethod: "bank_transfer",
        lateDays: Math.floor(Math.random() * 3),
        penaltyAmount: 0,
        createdAt: now,
      });
    }
    
    // Priya Sharma - Excellent payment history
    for (let i = 0; i < 6; i++) {
      repayments.push({
        repaymentId: `REP002_${i + 1}`,
        loanId: "LOAN002",
        beneficiaryId: "NBCFDC002",
        emiAmount: 3500,
        paidAmount: 3500,
        dueDate: now - ((6 - i) * 30 * 24 * 60 * 60 * 1000),
        paidDate: now - ((6 - i) * 30 * 24 * 60 * 60 * 1000) - (24 * 60 * 60 * 1000),
        status: "paid",
        paymentMethod: "upi",
        lateDays: 0,
        penaltyAmount: 0,
        createdAt: now,
      });
    }
    
    for (const repayment of repayments) {
      await ctx.db.insert("repayments", repayment);
    }
    
    // Create comprehensive consumption data
    const consumptionData = [];
    
    // Generate consumption data for all beneficiaries
    const beneficiaryConsumptionProfiles = [
      { id: "NBCFDC001", baseUnits: 180, baseBill: 1200, variance: 40, source: "Rajasthan State Electricity Board" },
      { id: "NBCFDC002", baseUnits: 120, baseBill: 800, variance: 30, source: "MP State Electricity Board" },
      { id: "NBCFDC003", baseUnits: 200, baseBill: 1400, variance: 50, source: "Gujarat State Electricity Board" },
      { id: "NBCFDC004", baseUnits: 90, baseBill: 600, variance: 25, source: "Maharashtra State Electricity Board" },
      { id: "NBCFDC005", baseUnits: 250, baseBill: 1800, variance: 60, source: "UP State Electricity Board" },
      { id: "NBCFDC006", baseUnits: 80, baseBill: 500, variance: 20, source: "Bihar State Electricity Board" },
      { id: "NBCFDC007", baseUnits: 160, baseBill: 1100, variance: 35, source: "MP State Electricity Board" },
      { id: "NBCFDC008", baseUnits: 140, baseBill: 950, variance: 30, source: "UP State Electricity Board" },
      { id: "NBCFDC009", baseUnits: 170, baseBill: 1150, variance: 40, source: "Karnataka State Electricity Board" },
      { id: "NBCFDC010", baseUnits: 100, baseBill: 650, variance: 25, source: "Tamil Nadu State Electricity Board" },
    ];
    
    // Generate 6-12 months of data for each beneficiary
    for (const profile of beneficiaryConsumptionProfiles) {
      const monthsOfData = 6 + Math.floor(Math.random() * 7); // 6-12 months
      for (let i = 0; i < monthsOfData; i++) {
        const month = new Date(now - (i * 30 * 24 * 60 * 60 * 1000));
        const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        
        // Add seasonal variation
        const seasonalFactor = 1 + 0.2 * Math.sin((month.getMonth() / 12) * 2 * Math.PI);
        
        consumptionData.push({
          dataId: `DATA_${profile.id}_electricity_${monthYear}`,
          beneficiaryId: profile.id,
          dataType: "electricity",
          dataSource: profile.source,
          monthYear,
          metrics: {
            electricityUnits: Math.floor((profile.baseUnits + Math.floor(Math.random() * profile.variance)) * seasonalFactor),
            electricityBill: Math.floor((profile.baseBill + Math.floor(Math.random() * (profile.variance * 10))) * seasonalFactor),
          },
          uploadedBy: "SYSTEM",
          verificationStatus: "verified",
          createdAt: now,
        });
      }
    }
    
    for (const data of consumptionData) {
      await ctx.db.insert("consumptionData", data);
    }
    
    // Create credit scores
    const creditScores = [
      {
        scoreId: "SCORE_NBCFDC001_001",
        beneficiaryId: "NBCFDC001",
        scoreVersion: "v1.0",
        repaymentScore: 85,
        incomeScore: 72,
        compositeScore: 79,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: {
            onTimePayments: 9,
            totalPayments: 10,
            averageDelay: 1.2,
            npaHistory: false,
          },
          loanUtilization: {
            totalLoansCount: 1,
            totalLoanAmount: 150000,
            repeatBorrower: false,
          },
          incomeIndicators: {
            estimatedMonthlyIncome: 28000,
            incomeStability: 0.9,
            consumptionPattern: "low",
          },
        },
        modelExplanation: [
          {
            factor: "On-time Payment Ratio",
            impact: 18,
            description: "9/10 payments made on time",
          },
          {
            factor: "Low Electricity Usage",
            impact: 12,
            description: "Below average consumption indicates need",
          },
          {
            factor: "Stable Income Pattern",
            impact: -6,
            description: "Consistent monthly patterns",
          },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC002_001",
        beneficiaryId: "NBCFDC002",
        scoreVersion: "v1.0",
        repaymentScore: 95,
        incomeScore: 85,
        compositeScore: 91,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: {
            onTimePayments: 6,
            totalPayments: 6,
            averageDelay: 0,
            npaHistory: false,
          },
          loanUtilization: {
            totalLoansCount: 1,
            totalLoanAmount: 75000,
            repeatBorrower: false,
          },
          incomeIndicators: {
            estimatedMonthlyIncome: 18000,
            incomeStability: 0.8,
            consumptionPattern: "low",
          },
        },
        modelExplanation: [
          {
            factor: "Perfect Payment Record",
            impact: 25,
            description: "6/6 payments made early",
          },
          {
            factor: "Very Low Income",
            impact: 20,
            description: "High need for concessional lending",
          },
          {
            factor: "ST Category",
            impact: 8,
            description: "Priority category for lending",
          },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC003_001",
        beneficiaryId: "NBCFDC003",
        scoreVersion: "v1.0",
        repaymentScore: 50,
        incomeScore: 65,
        compositeScore: 56,
        riskBand: "High Risk-High Need",
        scoreComponents: {
          repaymentHistory: {
            onTimePayments: 0,
            totalPayments: 0,
            averageDelay: 0,
            npaHistory: false,
          },
          loanUtilization: {
            totalLoansCount: 0,
            totalLoanAmount: 0,
            repeatBorrower: false,
          },
          incomeIndicators: {
            estimatedMonthlyIncome: 22000,
            incomeStability: 0.5,
            consumptionPattern: "medium",
          },
        },
        modelExplanation: [
          {
            factor: "No Credit History",
            impact: -15,
            description: "New borrower with no payment history",
          },
          {
            factor: "Moderate Income Level",
            impact: 10,
            description: "Shows need for financial assistance",
          },
          {
            factor: "OBC Category",
            impact: 5,
            description: "Eligible category for lending",
          },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
    ];
    
    // Create comprehensive credit scores for all beneficiaries
    const allCreditScores = [
      {
        scoreId: "SCORE_NBCFDC004_001",
        beneficiaryId: "NBCFDC004",
        scoreVersion: "v1.0",
        repaymentScore: 88,
        incomeScore: 75,
        compositeScore: 82,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 15000, incomeStability: 0.8, consumptionPattern: "low" },
        },
        modelExplanation: [
          { factor: "Low Income Level", impact: 15, description: "High need for financial assistance" },
          { factor: "SC Category", impact: 12, description: "Priority category for lending" },
          { factor: "Small Family Size", impact: 8, description: "Lower financial burden" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC005_001",
        beneficiaryId: "NBCFDC005",
        scoreVersion: "v1.0",
        repaymentScore: 65,
        incomeScore: 70,
        compositeScore: 67,
        riskBand: "High Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 20000, incomeStability: 0.6, consumptionPattern: "medium" },
        },
        modelExplanation: [
          { factor: "Agriculture Income", impact: 10, description: "Seasonal income variability" },
          { factor: "Large Family Size", impact: -8, description: "Higher financial burden" },
          { factor: "OBC Category", impact: 5, description: "Eligible category for lending" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC006_001",
        beneficiaryId: "NBCFDC006",
        scoreVersion: "v1.0",
        repaymentScore: 78,
        incomeScore: 85,
        compositeScore: 81,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 12000, incomeStability: 0.9, consumptionPattern: "low" },
        },
        modelExplanation: [
          { factor: "Very Low Income", impact: 20, description: "High need for concessional lending" },
          { factor: "ST Category", impact: 15, description: "Priority category for lending" },
          { factor: "Young Age", impact: 8, description: "Long-term earning potential" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC007_001",
        beneficiaryId: "NBCFDC007",
        scoreVersion: "v1.0",
        repaymentScore: 72,
        incomeScore: 68,
        compositeScore: 70,
        riskBand: "Low Risk-Low Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 25000, incomeStability: 0.7, consumptionPattern: "medium" },
        },
        modelExplanation: [
          { factor: "Skilled Occupation", impact: 12, description: "Stable income from carpentry" },
          { factor: "Moderate Income", impact: 5, description: "Decent earning capacity" },
          { factor: "General Category", impact: -3, description: "Lower priority for concessional lending" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC008_001",
        beneficiaryId: "NBCFDC008",
        scoreVersion: "v1.0",
        repaymentScore: 75,
        incomeScore: 72,
        compositeScore: 74,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 18000, incomeStability: 0.8, consumptionPattern: "medium" },
        },
        modelExplanation: [
          { factor: "Food Processing Business", impact: 10, description: "Growing sector with potential" },
          { factor: "OBC Category", impact: 8, description: "Eligible category for lending" },
          { factor: "Female Entrepreneur", impact: 12, description: "Priority for women empowerment" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC009_001",
        beneficiaryId: "NBCFDC009",
        scoreVersion: "v1.0",
        repaymentScore: 80,
        incomeScore: 78,
        compositeScore: 79,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 22000, incomeStability: 0.85, consumptionPattern: "medium" },
        },
        modelExplanation: [
          { factor: "Technical Skills", impact: 15, description: "Electronics repair has good demand" },
          { factor: "SC Category", impact: 10, description: "Priority category for lending" },
          { factor: "Urban Location", impact: 5, description: "Better market access" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
      {
        scoreId: "SCORE_NBCFDC010_001",
        beneficiaryId: "NBCFDC010",
        scoreVersion: "v1.0",
        repaymentScore: 85,
        incomeScore: 80,
        compositeScore: 83,
        riskBand: "Low Risk-High Need",
        scoreComponents: {
          repaymentHistory: { onTimePayments: 0, totalPayments: 0, averageDelay: 0, npaHistory: false },
          loanUtilization: { totalLoansCount: 0, totalLoanAmount: 0, repeatBorrower: false },
          incomeIndicators: { estimatedMonthlyIncome: 16000, incomeStability: 0.9, consumptionPattern: "low" },
        },
        modelExplanation: [
          { factor: "Traditional Craft Skills", impact: 18, description: "Weaving has export potential" },
          { factor: "ST Category", impact: 15, description: "Priority category for lending" },
          { factor: "Young Female Entrepreneur", impact: 10, description: "High priority for empowerment" },
        ],
        calculatedAt: now,
        validUntil: now + (30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      },
    ];

    // Add all credit scores (existing + new)
    const allScores = [...creditScores, ...allCreditScores];
    for (const score of allScores) {
      await ctx.db.insert("creditScores", score);
    }

    // Create comprehensive sample digital lending applications
    const applications = [
      {
        applicationId: "APP_NBCFDC001_001",
        beneficiaryId: "NBCFDC001",
        requestedAmount: 200000,
        purpose: "business",
        creditScoreId: "SCORE_NBCFDC001_001",
        autoApprovalEligible: false,
        approvalStatus: "manual_review",
        conditions: ["Amount exceeds auto-approval limit"],
        createdAt: now - (2 * 24 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC002_001",
        beneficiaryId: "NBCFDC002",
        requestedAmount: 100000,
        purpose: "skill_development",
        creditScoreId: "SCORE_NBCFDC002_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 100000,
        approvedTenure: 36,
        interestRate: 4.0,
        conditions: [],
        processedAt: now - (24 * 60 * 60 * 1000),
        processingTime: 45,
        createdAt: now - (24 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC003_001",
        beneficiaryId: "NBCFDC003",
        requestedAmount: 150000,
        purpose: "equipment",
        creditScoreId: "SCORE_NBCFDC003_001",
        autoApprovalEligible: false,
        approvalStatus: "manual_review",
        conditions: ["New borrower requires manual assessment"],
        createdAt: now - (12 * 60 * 60 * 1000),
      },
      // Additional applications for more realistic data
      {
        applicationId: "APP_NBCFDC004_001",
        beneficiaryId: "NBCFDC004",
        requestedAmount: 75000,
        purpose: "business",
        creditScoreId: "SCORE_NBCFDC004_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 75000,
        approvedTenure: 24,
        interestRate: 4.5,
        conditions: [],
        processedAt: now - (18 * 60 * 60 * 1000),
        processingTime: 32,
        createdAt: now - (18 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC005_001",
        beneficiaryId: "NBCFDC005",
        requestedAmount: 120000,
        purpose: "agriculture",
        creditScoreId: "SCORE_NBCFDC005_001",
        autoApprovalEligible: false,
        approvalStatus: "manual_review",
        conditions: ["High risk score requires manual review"],
        createdAt: now - (8 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC006_001",
        beneficiaryId: "NBCFDC006",
        requestedAmount: 50000,
        purpose: "skill_development",
        creditScoreId: "SCORE_NBCFDC006_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 50000,
        approvedTenure: 18,
        interestRate: 3.5,
        conditions: [],
        processedAt: now - (6 * 60 * 60 * 1000),
        processingTime: 28,
        createdAt: now - (6 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC007_001",
        beneficiaryId: "NBCFDC007",
        requestedAmount: 90000,
        purpose: "equipment",
        creditScoreId: "SCORE_NBCFDC007_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 90000,
        approvedTenure: 30,
        interestRate: 5.0,
        conditions: [],
        processedAt: now - (4 * 60 * 60 * 1000),
        processingTime: 38,
        createdAt: now - (4 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC008_001",
        beneficiaryId: "NBCFDC008",
        requestedAmount: 80000,
        purpose: "business",
        creditScoreId: "SCORE_NBCFDC008_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 80000,
        approvedTenure: 24,
        interestRate: 4.0,
        conditions: [],
        processedAt: now - (3 * 60 * 60 * 1000),
        processingTime: 25,
        createdAt: now - (3 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC009_001",
        beneficiaryId: "NBCFDC009",
        requestedAmount: 110000,
        purpose: "equipment",
        creditScoreId: "SCORE_NBCFDC009_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 110000,
        approvedTenure: 36,
        interestRate: 4.5,
        conditions: [],
        processedAt: now - (2 * 60 * 60 * 1000),
        processingTime: 35,
        createdAt: now - (2 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC010_001",
        beneficiaryId: "NBCFDC010",
        requestedAmount: 65000,
        purpose: "skill_development",
        creditScoreId: "SCORE_NBCFDC010_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 65000,
        approvedTenure: 24,
        interestRate: 3.5,
        conditions: [],
        processedAt: now - (1 * 60 * 60 * 1000),
        processingTime: 22,
        createdAt: now - (1 * 60 * 60 * 1000),
      },
      // Some recent applications for today
      {
        applicationId: "APP_NBCFDC001_002",
        beneficiaryId: "NBCFDC001",
        requestedAmount: 85000,
        purpose: "working_capital",
        creditScoreId: "SCORE_NBCFDC001_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 85000,
        approvedTenure: 24,
        interestRate: 5.5,
        conditions: [],
        processedAt: now - (30 * 60 * 1000),
        processingTime: 18,
        createdAt: now - (30 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC002_002",
        beneficiaryId: "NBCFDC002",
        requestedAmount: 45000,
        purpose: "equipment",
        creditScoreId: "SCORE_NBCFDC002_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 45000,
        approvedTenure: 18,
        interestRate: 3.0,
        conditions: [],
        processedAt: now - (15 * 60 * 1000),
        processingTime: 12,
        createdAt: now - (15 * 60 * 1000),
      },
    ];
    
    for (const app of applications) {
      await ctx.db.insert("digitalLendingApplications", app);
    }
    
    return {
      success: true,
      message: "Complete sample data initialized successfully",
      counts: {
        beneficiaries: beneficiaries.length,
        loans: loans.length,
        repayments: repayments.length,
        consumptionData: consumptionData.length,
        creditScores: allScores.length,
        applications: applications.length,
      },
    };
  },
});

