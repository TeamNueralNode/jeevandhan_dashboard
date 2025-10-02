import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Digital Lending Application Processing
export const processLendingApplication = mutation({
  args: {
    beneficiaryId: v.string(),
    requestedAmount: v.number(),
    purpose: v.string(),
    requestedTenure: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get beneficiary details
    const beneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }
    
    if (beneficiary.status !== "active") {
      throw new Error("Beneficiary is not active");
    }
    
    // Get latest credit score
    const latestScore = await ctx.db
      .query("creditScores")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .order("desc")
      .first();
    
    if (!latestScore) {
      throw new Error("No credit score available. Please calculate credit score first.");
    }
    
    // Check if score is still valid (within 30 days)
    const now = Date.now();
    if (latestScore.validUntil < now) {
      throw new Error("Credit score has expired. Please recalculate credit score.");
    }
    
    // Auto-approval logic
    const autoApprovalResult = determineAutoApproval(
      latestScore,
      args.requestedAmount,
      args.purpose,
      beneficiary
    );
    
    const applicationId = `APP_${args.beneficiaryId}_${Date.now()}`;
    
    // Create application record
    const application = {
      applicationId,
      beneficiaryId: args.beneficiaryId,
      requestedAmount: args.requestedAmount,
      purpose: args.purpose,
      creditScoreId: latestScore.scoreId,
      autoApprovalEligible: autoApprovalResult.eligible,
      approvalStatus: autoApprovalResult.status,
      approvedAmount: autoApprovalResult.approvedAmount,
      approvedTenure: autoApprovalResult.approvedTenure,
      interestRate: autoApprovalResult.interestRate,
      conditions: autoApprovalResult.conditions,
      processedAt: autoApprovalResult.status !== "manual_review" ? now : undefined,
      processingTime: autoApprovalResult.status !== "manual_review" ? 
        Math.floor(Math.random() * 30) + 10 : undefined, // Simulated processing time
      rejectionReason: autoApprovalResult.rejectionReason,
      createdAt: now,
    };
    
    const applicationDbId = await ctx.db.insert("digitalLendingApplications", application);
    
    // If auto-approved, create loan record
    if (autoApprovalResult.status === "auto_approved") {
      await createLoanFromApplication(ctx, application, beneficiary);
    }
    
    return {
      applicationId,
      status: autoApprovalResult.status,
      approvedAmount: autoApprovalResult.approvedAmount,
      processingTime: application.processingTime,
      message: getStatusMessage(autoApprovalResult.status, autoApprovalResult.rejectionReason),
    };
  },
});

// Helper function to determine auto-approval eligibility
function determineAutoApproval(
  creditScore: any,
  requestedAmount: number,
  purpose: string,
  beneficiary: any
) {
  const result = {
    eligible: false,
    status: "manual_review" as "auto_approved" | "manual_review" | "rejected",
    approvedAmount: undefined as number | undefined,
    approvedTenure: undefined as number | undefined,
    interestRate: undefined as number | undefined,
    conditions: [] as string[],
    rejectionReason: undefined as string | undefined,
  };
  
  // Basic eligibility criteria
  const minScoreForAutoApproval = 70;
  const maxAutoApprovalAmount = 200000; // 2 Lakhs
  const allowedPurposes = ["business", "education", "skill_development", "equipment"];
  
  // Check minimum score requirement
  if (creditScore.compositeScore < minScoreForAutoApproval) {
    result.status = "manual_review";
    result.conditions.push("Credit score below auto-approval threshold");
    return result;
  }
  
  // Check amount limit
  if (requestedAmount > maxAutoApprovalAmount) {
    result.status = "manual_review";
    result.conditions.push("Amount exceeds auto-approval limit");
    return result;
  }
  
  // Check purpose eligibility
  if (!allowedPurposes.includes(purpose)) {
    result.status = "manual_review";
    result.conditions.push("Purpose requires manual review");
    return result;
  }
  
  // Check risk band
  if (creditScore.riskBand === "High Risk-Low Need") {
    result.status = "rejected";
    result.rejectionReason = "High risk profile with low need assessment";
    return result;
  }
  
  // Auto-approval logic
  result.eligible = true;
  result.status = "auto_approved";
  
  // Determine approved amount (may be less than requested)
  const maxAmountByScore = Math.floor(creditScore.compositeScore * 2500); // Up to 2.5L for score 100
  result.approvedAmount = Math.min(requestedAmount, maxAmountByScore);
  
  // Determine tenure (12-60 months based on amount and score)
  if (result.approvedAmount <= 50000) {
    result.approvedTenure = 24; // 2 years
  } else if (result.approvedAmount <= 100000) {
    result.approvedTenure = 36; // 3 years
  } else {
    result.approvedTenure = 48; // 4 years
  }
  
  // Determine interest rate based on risk band and score
  if (creditScore.riskBand === "Low Risk-High Need") {
    result.interestRate = 4.0; // Highly concessional
  } else if (creditScore.riskBand === "Low Risk-Low Need") {
    result.interestRate = 6.0; // Moderate concessional
  } else if (creditScore.riskBand === "High Risk-High Need") {
    result.interestRate = 8.0; // Higher rate but still concessional
  }
  
  // Add conditions based on score and risk
  if (creditScore.compositeScore < 80) {
    result.conditions.push("Monthly income verification required");
  }
  
  if (result.approvedAmount < requestedAmount) {
    result.conditions.push(`Amount reduced from ₹${requestedAmount.toLocaleString()} based on credit assessment`);
  }
  
  return result;
}

// Helper function to create loan from approved application
async function createLoanFromApplication(ctx: any, application: any, beneficiary: any) {
  const loanId = `LOAN_${application.beneficiaryId}_${Date.now()}`;
  const now = Date.now();
  
  // Ensure all required fields are present
  const loanAmount = application.approvedAmount || application.requestedAmount || 100000;
  const loanTenure = application.approvedTenure || 36;
  const interestRate = application.interestRate || 6.0;
  
  await ctx.db.insert("loans", {
    loanId,
    beneficiaryId: application.beneficiaryId,
    loanAmount,
    loanTenure,
    interestRate,
    purpose: application.purpose,
    sanctionDate: now,
    disbursementDate: now,
    maturityDate: now + (loanTenure * 30 * 24 * 60 * 60 * 1000),
    status: "sanctioned",
    loanType: application.purpose,
    channelPartner: beneficiary.channelPartner,
    approvedBy: "AUTO_SYSTEM",
    createdAt: now,
    updatedAt: now,
  });
}

// Helper function to get status message
function getStatusMessage(status: string, rejectionReason?: string) {
  switch (status) {
    case "auto_approved":
      return "Congratulations! Your loan has been automatically approved and will be disbursed within 24 hours.";
    case "manual_review":
      return "Your application is under review. You will be notified within 3-5 business days.";
    case "rejected":
      return `Application rejected: ${rejectionReason}`;
    default:
      return "Application submitted successfully.";
  }
}

// Query to get lending applications with filters
export const getLendingApplications = query({
  args: {
    status: v.optional(v.string()),
    beneficiaryId: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("digitalLendingApplications");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("approvalStatus"), args.status));
    }
    
    if (args.beneficiaryId) {
      query = query.filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId));
    }
    
    return await query
      .order("desc")
      .paginate({
        numItems: args.limit || 20,
        cursor: args.cursor || null,
      });
  },
});

// Query to get digital lending analytics
export const getDigitalLendingAnalytics = query({
  args: {
    fromDate: v.optional(v.number()),
    toDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("digitalLendingApplications");
    
    if (args.fromDate) {
      query = query.filter((q) => q.gte(q.field("createdAt"), args.fromDate!));
    }
    
    if (args.toDate) {
      query = query.filter((q) => q.lte(q.field("createdAt"), args.toDate!));
    }
    
    const applications = await query.collect();
    
    const analytics = {
      totalApplications: applications.length,
      autoApproved: applications.filter(a => a.approvalStatus === "auto_approved").length,
      manualReview: applications.filter(a => a.approvalStatus === "manual_review").length,
      rejected: applications.filter(a => a.approvalStatus === "rejected").length,
      totalApprovedAmount: 0,
      averageProcessingTime: 0,
      autoApprovalRate: 0,
      purposeDistribution: {} as Record<string, number>,
      dailyApplications: {} as Record<string, number>,
    };
    
    if (applications.length > 0) {
      // Calculate totals
      analytics.totalApprovedAmount = applications
        .filter(a => a.approvedAmount)
        .reduce((sum, a) => sum + (a.approvedAmount || 0), 0);
      
      // Calculate average processing time (only for processed applications)
      const processedApps = applications.filter(a => a.processingTime);
      if (processedApps.length > 0) {
        analytics.averageProcessingTime = Math.round(
          processedApps.reduce((sum, a) => sum + (a.processingTime || 0), 0) / processedApps.length
        );
      }
      
      // Calculate auto-approval rate
      analytics.autoApprovalRate = Math.round(
        (analytics.autoApproved / analytics.totalApplications) * 100
      );
      
      // Purpose distribution
      applications.forEach(app => {
        analytics.purposeDistribution[app.purpose] = 
          (analytics.purposeDistribution[app.purpose] || 0) + 1;
      });
      
      // Daily applications
      applications.forEach(app => {
        const date = new Date(app.createdAt).toISOString().split('T')[0];
        analytics.dailyApplications[date] = (analytics.dailyApplications[date] || 0) + 1;
      });
    }
    
    return analytics;
  },
});

// Mutation to manually review and approve/reject application
export const reviewLendingApplication = mutation({
  args: {
    applicationId: v.string(),
    decision: v.string(), // "approve" or "reject"
    approvedAmount: v.optional(v.number()),
    approvedTenure: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    conditions: v.optional(v.array(v.string())),
    rejectionReason: v.optional(v.string()),
    reviewedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db
      .query("digitalLendingApplications")
      .filter((q) => q.eq(q.field("applicationId"), args.applicationId))
      .first();
    
    if (!application) {
      throw new Error("Application not found");
    }
    
    // Allow review of applications that are not already finalized
    if (application.approvalStatus === "rejected" || application.approvalStatus === "cancelled") {
      throw new Error("Cannot review an application that has already been rejected or cancelled");
    }
    
    const now = Date.now();
    const updates: any = {
      approvalStatus: args.decision === "approve" ? "auto_approved" : "rejected",
      processedAt: now,
      processingTime: Math.floor((now - application.createdAt) / 1000), // in seconds
      reviewedBy: args.reviewedBy,
    };
    
    if (args.decision === "approve") {
      updates.approvedAmount = args.approvedAmount || application.requestedAmount;
      updates.approvedTenure = args.approvedTenure || 36;
      updates.interestRate = args.interestRate || 6.0;
      updates.conditions = args.conditions || [];
      
      // Create loan record
      const beneficiary = await ctx.db
        .query("beneficiaries")
        .filter((q) => q.eq(q.field("beneficiaryId"), application.beneficiaryId))
        .first();
      
      if (beneficiary) {
        await createLoanFromApplication(ctx, { ...application, ...updates }, beneficiary);
      }
    } else {
      updates.rejectionReason = args.rejectionReason;
    }
    
    await ctx.db.patch(application._id, updates);
    
    return {
      success: true,
      status: updates.approvalStatus,
      message: getStatusMessage(updates.approvalStatus, args.rejectionReason),
    };
  },
});
