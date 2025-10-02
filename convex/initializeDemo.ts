import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Complete demo initialization with proper data relationships
export const initializeCompleteDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    try {
      // 1. Initialize admin role first
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

      // 2. Create sample beneficiaries with proper IDs
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
      ];

      // Insert beneficiaries
      for (const beneficiary of beneficiaries) {
        const existing = await ctx.db
          .query("beneficiaries")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiary.beneficiaryId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("beneficiaries", beneficiary);
        }
      }

      // 3. Create sample loans
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
        const existing = await ctx.db
          .query("loans")
          .filter((q) => q.eq(q.field("loanId"), loan.loanId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("loans", loan);
        }
      }

      // 4. Create repayment history
      const repayments = [
        // Rajesh Kumar - Good payment history
        ...Array.from({ length: 10 }, (_, i) => ({
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
        })),
        // Priya Sharma - Excellent payment history
        ...Array.from({ length: 6 }, (_, i) => ({
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
        })),
      ];

      for (const repayment of repayments) {
        const existing = await ctx.db
          .query("repayments")
          .filter((q) => q.eq(q.field("repaymentId"), repayment.repaymentId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("repayments", repayment);
        }
      }

      // 5. Create consumption data
      const consumptionData = [
        // Rajesh Kumar - Electricity data
        ...Array.from({ length: 12 }, (_, i) => {
          const month = new Date(now - (i * 30 * 24 * 60 * 60 * 1000));
          const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
          return {
            dataId: `DATA_NBCFDC001_electricity_${monthYear}`,
            beneficiaryId: "NBCFDC001",
            dataType: "electricity",
            dataSource: "Rajasthan State Electricity Board",
            monthYear,
            metrics: {
              electricityUnits: 180 + Math.floor(Math.random() * 40),
              electricityBill: 1200 + Math.floor(Math.random() * 400),
            },
            uploadedBy: "SYSTEM",
            verificationStatus: "verified",
            createdAt: now,
          };
        }),
        // Priya Sharma - Lower consumption
        ...Array.from({ length: 8 }, (_, i) => {
          const month = new Date(now - (i * 30 * 24 * 60 * 60 * 1000));
          const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
          return {
            dataId: `DATA_NBCFDC002_electricity_${monthYear}`,
            beneficiaryId: "NBCFDC002",
            dataType: "electricity",
            dataSource: "MP State Electricity Board",
            monthYear,
            metrics: {
              electricityUnits: 80 + Math.floor(Math.random() * 30),
              electricityBill: 600 + Math.floor(Math.random() * 200),
            },
            uploadedBy: "SYSTEM",
            verificationStatus: "verified",
            createdAt: now,
          };
        }),
      ];

      for (const data of consumptionData) {
        const existing = await ctx.db
          .query("consumptionData")
          .filter((q) => q.eq(q.field("dataId"), data.dataId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("consumptionData", data);
        }
      }

      // 6. Calculate and create credit scores
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
              onTimePayments: 10,
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
              consumptionPattern: "medium",
            },
          },
          modelExplanation: [
            {
              factor: "On-time Payment Ratio",
              impact: 18,
              description: "10/10 payments made on time",
            },
            {
              factor: "Low Electricity Usage",
              impact: 12,
              description: "Below average consumption indicates need",
            },
            {
              factor: "Late Bill Payment",
              impact: -6,
              description: "Occasional delays in utility payments",
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
              factor: "Perfect Payment History",
              impact: 25,
              description: "6/6 payments made early",
            },
            {
              factor: "Very Low Income",
              impact: 20,
              description: "High need for concessional lending",
            },
            {
              factor: "Consistent Data",
              impact: 8,
              description: "Regular consumption data available",
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
          incomeScore: 60,
          compositeScore: 54,
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
              factor: "New Borrower",
              impact: 0,
              description: "No previous loan history available",
            },
            {
              factor: "Medium Income Level",
              impact: 10,
              description: "Moderate need for concessional lending",
            },
            {
              factor: "Limited Data",
              impact: -5,
              description: "Insufficient consumption data for assessment",
            },
          ],
          calculatedAt: now,
          validUntil: now + (30 * 24 * 60 * 60 * 1000),
          createdAt: now,
        },
      ];

      for (const score of creditScores) {
        const existing = await ctx.db
          .query("creditScores")
          .filter((q) => q.eq(q.field("scoreId"), score.scoreId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("creditScores", score);
        }
      }

      // 7. Create digital lending applications
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
          createdAt: now - (12 * 60 * 60 * 1000),
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
          conditions: ["Excellent credit profile"],
          processedAt: now - (6 * 60 * 60 * 1000),
          processingTime: 45,
          createdAt: now - (6 * 60 * 60 * 1000),
        },
        {
          applicationId: "APP_NBCFDC003_001",
          beneficiaryId: "NBCFDC003",
          requestedAmount: 80000,
          purpose: "equipment",
          creditScoreId: "SCORE_NBCFDC003_001",
          autoApprovalEligible: false,
          approvalStatus: "manual_review",
          conditions: ["New borrower requires manual assessment"],
          createdAt: now - (2 * 60 * 60 * 1000),
        },
      ];

      for (const app of applications) {
        const existing = await ctx.db
          .query("digitalLendingApplications")
          .filter((q) => q.eq(q.field("applicationId"), app.applicationId))
          .first();
        
        if (!existing) {
          await ctx.db.insert("digitalLendingApplications", app);
        }
      }

      return {
        success: true,
        message: "Complete demo data initialized successfully",
        data: {
          beneficiaries: beneficiaries.length,
          loans: loans.length,
          repayments: repayments.length,
          consumptionData: consumptionData.length,
          creditScores: creditScores.length,
          applications: applications.length,
        },
      };

    } catch (error) {
      console.error("Error initializing demo data:", error);
      return {
        success: false,
        message: "Failed to initialize demo data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
