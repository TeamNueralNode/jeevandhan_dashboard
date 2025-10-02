import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Authentication & User Management
  roles: defineTable({
    roleId: v.string(),
    password: v.string(),
    roleName: v.string(),
    permissions: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_roleId", ["roleId"]),

  // Beneficiary Management
  beneficiaries: defineTable({
    beneficiaryId: v.string(), // Unique identifier
    name: v.string(),
    phoneNumber: v.string(),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
    }),
    demographicInfo: v.object({
      age: v.number(),
      gender: v.string(),
      category: v.string(), // SC/ST/OBC etc.
      familySize: v.number(),
      occupation: v.string(),
    }),
    kycDocuments: v.object({
      aadhaar: v.optional(v.string()),
      pan: v.optional(v.string()),
      bankAccount: v.optional(v.string()),
    }),
    registrationDate: v.number(),
    status: v.string(), // "active", "inactive", "suspended"
    channelPartner: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_phoneNumber", ["phoneNumber"])
    .index("by_channelPartner", ["channelPartner"]),

  // Loan Management
  loans: defineTable({
    loanId: v.string(),
    beneficiaryId: v.string(),
    loanAmount: v.number(),
    loanTenure: v.number(), // in months
    interestRate: v.number(),
    purpose: v.string(),
    sanctionDate: v.number(),
    disbursementDate: v.optional(v.number()),
    maturityDate: v.number(),
    status: v.string(), // "applied", "sanctioned", "disbursed", "closed", "npa"
    loanType: v.string(), // "business", "education", "housing", etc.
    channelPartner: v.string(),
    approvedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_loanId", ["loanId"])
    .index("by_status", ["status"]),

  // Repayment History
  repayments: defineTable({
    repaymentId: v.string(),
    loanId: v.string(),
    beneficiaryId: v.string(),
    emiAmount: v.number(),
    paidAmount: v.number(),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    status: v.string(), // "paid", "overdue", "partial", "missed"
    paymentMethod: v.optional(v.string()),
    lateDays: v.optional(v.number()),
    penaltyAmount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_loanId", ["loanId"])
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_dueDate", ["dueDate"]),

  // Consumption Data for Income Verification
  consumptionData: defineTable({
    dataId: v.string(),
    beneficiaryId: v.string(),
    dataType: v.string(), // "electricity", "mobile", "utility", "survey"
    dataSource: v.string(), // Source of data
    monthYear: v.string(), // "2024-01" format
    metrics: v.object({
      electricityUnits: v.optional(v.number()),
      electricityBill: v.optional(v.number()),
      mobileRecharges: v.optional(v.array(v.object({
        amount: v.number(),
        date: v.number(),
      }))),
      utilityBills: v.optional(v.array(v.object({
        type: v.string(), // "water", "gas", etc.
        amount: v.number(),
        date: v.number(),
      }))),
      surveyData: v.optional(v.object({
        householdIncome: v.optional(v.number()),
        assets: v.optional(v.array(v.string())),
        expenses: v.optional(v.number()),
      })),
    }),
    uploadedBy: v.string(),
    verificationStatus: v.string(), // "pending", "verified", "rejected"
    createdAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_dataType", ["dataType"])
    .index("by_monthYear", ["monthYear"]),

  // Consumption Documents (file uploads)
  consumptionDocuments: defineTable({
    documentId: v.string(),
    beneficiaryId: v.string(),
    consumptionDataId: v.string(), // Links to consumptionData
    documentType: v.string(), // "electricity_bill", "mobile_recharge", "utility_bill"
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(), // "image/jpeg", "application/pdf", etc.
    storageUrl: v.string(), // URL to stored file
    uploadDate: v.number(),
    verificationStatus: v.string(), // "pending", "verified", "rejected"
    verificationNotes: v.optional(v.string()),
    verifiedBy: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_consumptionDataId", ["consumptionDataId"])
    .index("by_documentType", ["documentType"])
    .index("by_verificationStatus", ["verificationStatus"]),

  // Credit Scores
  creditScores: defineTable({
    scoreId: v.string(),
    beneficiaryId: v.string(),
    scoreVersion: v.string(), // Model version used
    repaymentScore: v.number(), // 0-100
    incomeScore: v.number(), // 0-100
    compositeScore: v.number(), // 0-100
    riskBand: v.string(), // "Low Risk-High Need", "Low Risk-Low Need", etc.
    scoreComponents: v.object({
      repaymentHistory: v.object({
        onTimePayments: v.number(),
        totalPayments: v.number(),
        averageDelay: v.number(),
        npaHistory: v.boolean(),
      }),
      loanUtilization: v.object({
        totalLoansCount: v.number(),
        totalLoanAmount: v.number(),
        repeatBorrower: v.boolean(),
        loanToIncomeRatio: v.optional(v.number()),
      }),
      incomeIndicators: v.object({
        estimatedMonthlyIncome: v.optional(v.number()),
        incomeStability: v.number(), // 0-1
        consumptionPattern: v.string(), // "low", "medium", "high"
      }),
    }),
    modelExplanation: v.array(v.object({
      factor: v.string(),
      impact: v.number(), // -100 to +100
      description: v.string(),
    })),
    calculatedAt: v.number(),
    validUntil: v.number(),
    createdAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_riskBand", ["riskBand"])
    .index("by_compositeScore", ["compositeScore"]),

  // Digital Lending Applications
  digitalLendingApplications: defineTable({
    applicationId: v.string(),
    beneficiaryId: v.string(),
    requestedAmount: v.number(),
    purpose: v.string(),
    creditScoreId: v.string(), // Reference to credit score used
    autoApprovalEligible: v.boolean(),
    approvalStatus: v.string(), // "auto_approved", "manual_review", "rejected"
    approvedAmount: v.optional(v.number()),
    approvedTenure: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    conditions: v.optional(v.array(v.string())),
    processedAt: v.optional(v.number()),
    processingTime: v.optional(v.number()), // in seconds
    reviewedBy: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_beneficiaryId", ["beneficiaryId"])
    .index("by_approvalStatus", ["approvalStatus"])
    .index("by_autoApprovalEligible", ["autoApprovalEligible"]),

  // System Configuration
  systemConfig: defineTable({
    configKey: v.string(),
    configValue: v.any(),
    description: v.string(),
    updatedBy: v.string(),
    updatedAt: v.number(),
  }).index("by_configKey", ["configKey"]),
});