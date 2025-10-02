import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Initialize sample data for demonstration
export const initializeSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Sample beneficiaries
    const sampleBeneficiaries = [
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
        registrationDate: now - (365 * 24 * 60 * 60 * 1000), // 1 year ago
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
        registrationDate: now - (200 * 24 * 60 * 60 * 1000), // 200 days ago
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
        registrationDate: now - (150 * 24 * 60 * 60 * 1000), // 150 days ago
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Insert beneficiaries
    const beneficiaryIds = [];
    for (const beneficiary of sampleBeneficiaries) {
      const existing = await ctx.db
        .query("beneficiaries")
        .filter((q) => q.eq(q.field("beneficiaryId"), beneficiary.beneficiaryId))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("beneficiaries", beneficiary);
        beneficiaryIds.push({ dbId: id, beneficiaryId: beneficiary.beneficiaryId });
      }
    }
    
    // Sample loans
    const sampleLoans = [
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
    
    // Insert loans
    for (const loan of sampleLoans) {
      const existing = await ctx.db
        .query("loans")
        .filter((q) => q.eq(q.field("loanId"), loan.loanId))
        .first();
      
      if (!existing) {
        await ctx.db.insert("loans", loan);
      }
    }
    
    // Sample repayment history
    const sampleRepayments = [
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
        paidDate: now - ((6 - i) * 30 * 24 * 60 * 60 * 1000) - (24 * 60 * 60 * 1000), // Paid 1 day early
        status: "paid",
        paymentMethod: "upi",
        lateDays: 0,
        penaltyAmount: 0,
        createdAt: now,
      })),
    ];
    
    // Insert repayments
    for (const repayment of sampleRepayments) {
      const existing = await ctx.db
        .query("repayments")
        .filter((q) => q.eq(q.field("repaymentId"), repayment.repaymentId))
        .first();
      
      if (!existing) {
        await ctx.db.insert("repayments", repayment);
      }
    }
    
    // Sample consumption data
    const sampleConsumptionData = [
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
      // Rajesh Kumar - Mobile data
      ...Array.from({ length: 6 }, (_, i) => {
        const month = new Date(now - (i * 30 * 24 * 60 * 60 * 1000));
        const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        return {
          dataId: `DATA_NBCFDC001_mobile_${monthYear}`,
          beneficiaryId: "NBCFDC001",
          dataType: "mobile",
          dataSource: "Telecom Provider",
          monthYear,
          metrics: {
            mobileRecharges: [
              { amount: 199, date: now - (i * 30 * 24 * 60 * 60 * 1000) },
              { amount: 299, date: now - (i * 30 * 24 * 60 * 60 * 1000) + (15 * 24 * 60 * 60 * 1000) },
            ],
          },
          uploadedBy: "SYSTEM",
          verificationStatus: "verified",
          createdAt: now,
        };
      }),
      // Priya Sharma - Electricity data (lower consumption)
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
      // Survey data
      {
        dataId: "DATA_NBCFDC001_survey_2024-01",
        beneficiaryId: "NBCFDC001",
        dataType: "survey",
        dataSource: "Socio-Economic Survey 2024",
        monthYear: "2024-01",
        metrics: {
          surveyData: {
            householdIncome: 28000,
            assets: ["motorcycle", "mobile_phone", "television"],
            expenses: 22000,
          },
        },
        uploadedBy: "SURVEY_TEAM",
        verificationStatus: "verified",
        createdAt: now,
      },
    ];
    
    // Insert consumption data
    for (const data of sampleConsumptionData) {
      const existing = await ctx.db
        .query("consumptionData")
        .filter((q) => q.eq(q.field("dataId"), data.dataId))
        .first();
      
      if (!existing) {
        await ctx.db.insert("consumptionData", data);
      }
    }
    
    // Sample digital lending applications
    const sampleApplications = [
      {
        applicationId: "APP_NBCFDC003_001",
        beneficiaryId: "NBCFDC003",
        requestedAmount: 100000,
        purpose: "business",
        creditScoreId: "SCORE_NBCFDC003_001",
        autoApprovalEligible: true,
        approvalStatus: "auto_approved",
        approvedAmount: 85000,
        approvedTenure: 36,
        interestRate: 6.5,
        conditions: ["Monthly income verification required"],
        processedAt: now - (24 * 60 * 60 * 1000),
        processingTime: 45,
        createdAt: now - (24 * 60 * 60 * 1000),
      },
      {
        applicationId: "APP_NBCFDC001_002",
        beneficiaryId: "NBCFDC001",
        requestedAmount: 200000,
        purpose: "equipment",
        creditScoreId: "SCORE_NBCFDC001_001",
        autoApprovalEligible: false,
        approvalStatus: "manual_review",
        conditions: ["Amount exceeds auto-approval limit"],
        createdAt: now - (12 * 60 * 60 * 1000),
      },
    ];
    
    // Insert applications
    for (const app of sampleApplications) {
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
      message: "Sample data initialized successfully",
      beneficiariesCreated: beneficiaryIds.length,
      loansCreated: sampleLoans.length,
      repaymentsCreated: sampleRepayments.length,
      consumptionDataCreated: sampleConsumptionData.length,
      applicationsCreated: sampleApplications.length,
    };
  },
});

// Calculate credit scores for sample beneficiaries
export const calculateSampleCreditScores = mutation({
  args: {},
  handler: async (ctx) => {
    const beneficiaries = ["NBCFDC001", "NBCFDC002", "NBCFDC003"];
    const results = [];
    
    for (const beneficiaryId of beneficiaries) {
      try {
        // Check if beneficiary exists
        const beneficiary = await ctx.db
          .query("beneficiaries")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiaryId))
          .first();
        
        if (!beneficiary) continue;
        
        // Get loan and repayment history
        const loans = await ctx.db
          .query("loans")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiaryId))
          .collect();
        
        const repayments = await ctx.db
          .query("repayments")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiaryId))
          .collect();
        
        // Get consumption data
        const consumptionData = await ctx.db
          .query("consumptionData")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiaryId))
          .collect();
        
        // Calculate scores (simplified version)
        let repaymentScore = 50;
        let incomeScore = 50;
        
        // Repayment score calculation
        if (repayments.length > 0) {
          const onTimePayments = repayments.filter(r => r.status === "paid" && (r.lateDays || 0) <= 3).length;
          const onTimeRatio = onTimePayments / repayments.length;
          repaymentScore = Math.min(100, 30 + (onTimeRatio * 70));
        }
        
        // Income score calculation
        if (consumptionData.length > 0) {
          const electricityData = consumptionData.filter(d => d.dataType === "electricity");
          const avgElectricityBill = electricityData.length > 0 
            ? electricityData.reduce((sum, d) => sum + (d.metrics.electricityBill || 0), 0) / electricityData.length
            : 0;
          
          // Lower electricity bill = higher need = higher score for concessional lending
          if (avgElectricityBill > 0) {
            if (avgElectricityBill < 800) incomeScore = 80;
            else if (avgElectricityBill < 1200) incomeScore = 65;
            else if (avgElectricityBill < 1600) incomeScore = 50;
            else incomeScore = 35;
          }
        }
        
        const compositeScore = Math.round((repaymentScore * 0.6) + (incomeScore * 0.4));
        
        // Determine risk band
        let riskBand = "High Risk-Low Need";
        if (repaymentScore >= 70 && incomeScore >= 60) riskBand = "Low Risk-High Need";
        else if (repaymentScore >= 70 && incomeScore < 60) riskBand = "Low Risk-Low Need";
        else if (repaymentScore < 70 && incomeScore >= 60) riskBand = "High Risk-High Need";
        
        const scoreId = `SCORE_${beneficiaryId}_${Date.now()}`;
        const now = Date.now();
        
        // Check if score already exists
        const existingScore = await ctx.db
          .query("creditScores")
          .filter((q) => q.eq(q.field("beneficiaryId"), beneficiaryId))
          .first();
        
        if (!existingScore) {
          await ctx.db.insert("creditScores", {
            scoreId,
            beneficiaryId,
            scoreVersion: "v1.0",
            repaymentScore: Math.round(repaymentScore),
            incomeScore: Math.round(incomeScore),
            compositeScore,
            riskBand,
            scoreComponents: {
              repaymentHistory: {
                onTimePayments: repayments.filter(r => r.status === "paid" && (r.lateDays || 0) <= 3).length,
                totalPayments: repayments.length,
                averageDelay: repayments.length > 0 
                  ? repayments.reduce((sum, r) => sum + (r.lateDays || 0), 0) / repayments.length 
                  : 0,
                npaHistory: loans.some(l => l.status === "npa"),
              },
              loanUtilization: {
                totalLoansCount: loans.length,
                totalLoanAmount: loans.reduce((sum, l) => sum + l.loanAmount, 0),
                repeatBorrower: loans.length > 1,
              },
              incomeIndicators: {
                estimatedMonthlyIncome: consumptionData.find(d => d.metrics.surveyData?.householdIncome)?.metrics.surveyData?.householdIncome,
                incomeStability: Math.min(consumptionData.length / 12, 1),
                consumptionPattern: incomeScore > 60 ? "low" : incomeScore > 40 ? "medium" : "high",
              },
            },
            modelExplanation: [
              {
                factor: "Repayment History",
                impact: Math.round((repaymentScore - 50) * 0.6),
                description: `${repayments.length} payments with ${Math.round((repayments.filter(r => r.status === "paid").length / Math.max(repayments.length, 1)) * 100)}% success rate`,
              },
              {
                factor: "Income Assessment",
                impact: Math.round((incomeScore - 50) * 0.4),
                description: `Based on ${consumptionData.length} months of consumption data`,
              },
            ],
            calculatedAt: now,
            validUntil: now + (30 * 24 * 60 * 60 * 1000),
            createdAt: now,
          });
          
          results.push({
            beneficiaryId,
            compositeScore,
            riskBand,
            status: "created",
          });
        } else {
          results.push({
            beneficiaryId,
            status: "exists",
          });
        }
      } catch (error) {
        results.push({
          beneficiaryId,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    
    return {
      success: true,
      results,
    };
  },
});
