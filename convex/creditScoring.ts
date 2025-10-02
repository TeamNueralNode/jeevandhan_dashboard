import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Credit Scoring Algorithm Implementation
export const calculateCreditScore = mutation({
  args: {
    beneficiaryId: v.string(),
    scoreVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const beneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }
    
    // Get loan and repayment history
    const loans = await ctx.db
      .query("loans")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .collect();
    
    const repayments = await ctx.db
      .query("repayments")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .collect();
    
    // Get consumption data for income estimation
    const consumptionData = await ctx.db
      .query("consumptionData")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .collect();
    
    // Calculate Repayment Score (0-100)
    const repaymentScore = calculateRepaymentScore(loans, repayments);
    
    // Calculate Income Score (0-100)
    const incomeScore = calculateIncomeScore(consumptionData, beneficiary);
    
    // Calculate Composite Score (weighted average)
    const compositeScore = Math.round(
      (repaymentScore.score * 0.6) + (incomeScore.score * 0.4)
    );
    
    // Determine Risk Band
    const riskBand = determineRiskBand(repaymentScore.score, incomeScore.score, incomeScore.needLevel);
    
    // Create model explanation
    const modelExplanation = generateModelExplanation(repaymentScore, incomeScore);
    
    const scoreId = `SCORE_${args.beneficiaryId}_${Date.now()}`;
    const now = Date.now();
    
    // Save credit score
    const creditScoreId = await ctx.db.insert("creditScores", {
      scoreId,
      beneficiaryId: args.beneficiaryId,
      scoreVersion: args.scoreVersion || "v1.0",
      repaymentScore: repaymentScore.score,
      incomeScore: incomeScore.score,
      compositeScore,
      riskBand,
      scoreComponents: {
        repaymentHistory: repaymentScore.components,
        loanUtilization: repaymentScore.utilization,
        incomeIndicators: incomeScore.indicators,
      },
      modelExplanation,
      calculatedAt: now,
      validUntil: now + (30 * 24 * 60 * 60 * 1000), // Valid for 30 days
      createdAt: now,
    });
    
    return {
      scoreId: creditScoreId,
      compositeScore,
      riskBand,
      repaymentScore: repaymentScore.score,
      incomeScore: incomeScore.score,
    };
  },
});

// Helper function to calculate repayment score
function calculateRepaymentScore(loans: any[], repayments: any[]) {
  if (loans.length === 0) {
    return {
      score: 50, // Neutral score for new borrowers
      components: {
        onTimePayments: 0,
        totalPayments: 0,
        averageDelay: 0,
        npaHistory: false,
      },
      utilization: {
        totalLoansCount: 0,
        totalLoanAmount: 0,
        repeatBorrower: false,
        loanToIncomeRatio: undefined,
      },
    };
  }
  
  const totalPayments = repayments.length;
  const onTimePayments = repayments.filter(r => r.status === "paid" && (r.lateDays || 0) <= 3).length;
  const overduePayments = repayments.filter(r => r.status === "overdue" || (r.lateDays || 0) > 30).length;
  const npaLoans = loans.filter(l => l.status === "npa").length;
  
  // Calculate average delay
  const delayedPayments = repayments.filter(r => (r.lateDays || 0) > 0);
  const averageDelay = delayedPayments.length > 0 
    ? delayedPayments.reduce((sum, r) => sum + (r.lateDays || 0), 0) / delayedPayments.length 
    : 0;
  
  // Base score calculation
  let score = 50; // Start with neutral
  
  // On-time payment ratio (40% weight)
  if (totalPayments > 0) {
    const onTimeRatio = onTimePayments / totalPayments;
    score += (onTimeRatio - 0.5) * 80; // -40 to +40 points
  }
  
  // NPA penalty (30% weight)
  if (npaLoans > 0) {
    score -= Math.min(npaLoans * 15, 30); // Up to -30 points
  }
  
  // Average delay penalty (20% weight)
  if (averageDelay > 0) {
    score -= Math.min(averageDelay / 2, 20); // Up to -20 points
  }
  
  // Repeat borrower bonus (10% weight)
  if (loans.length > 1) {
    score += Math.min(loans.length * 2, 10); // Up to +10 points
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    score,
    components: {
      onTimePayments,
      totalPayments,
      averageDelay: Math.round(averageDelay * 10) / 10,
      npaHistory: npaLoans > 0,
    },
    utilization: {
      totalLoansCount: loans.length,
      totalLoanAmount: loans.reduce((sum, l) => sum + l.loanAmount, 0),
      repeatBorrower: loans.length > 1,
    },
  };
}

// Helper function to calculate income score
function calculateIncomeScore(consumptionData: any[], beneficiary: any) {
  if (consumptionData.length === 0) {
    return {
      score: 40, // Lower score due to lack of data
      needLevel: "high", // Assume high need without data
      indicators: {
        estimatedMonthlyIncome: undefined,
        incomeStability: 0.5,
        consumptionPattern: "unknown",
      },
    };
  }
  
  // Analyze electricity consumption
  const electricityData = consumptionData.filter(d => d.dataType === "electricity");
  const avgElectricityBill = electricityData.length > 0 
    ? electricityData.reduce((sum, d) => sum + (d.metrics.electricityBill || 0), 0) / electricityData.length
    : 0;
  
  // Analyze mobile recharge patterns
  const mobileData = consumptionData.filter(d => d.dataType === "mobile");
  const totalMobileRecharges = mobileData.reduce((sum, d) => {
    return sum + (d.metrics.mobileRecharges?.reduce((s: number, r: any) => s + r.amount, 0) || 0);
  }, 0);
  const avgMonthlyMobile = mobileData.length > 0 ? totalMobileRecharges / mobileData.length : 0;
  
  // Estimate monthly income based on consumption patterns
  let estimatedIncome = 0;
  
  // Electricity-based estimation (typically 3-5% of income)
  if (avgElectricityBill > 0) {
    estimatedIncome = Math.max(estimatedIncome, avgElectricityBill * 25); // Conservative multiplier
  }
  
  // Mobile-based estimation (typically 1-2% of income)
  if (avgMonthlyMobile > 0) {
    estimatedIncome = Math.max(estimatedIncome, avgMonthlyMobile * 60);
  }
  
  // Determine consumption pattern and need level
  let consumptionPattern = "low";
  let needLevel = "high";
  
  if (avgElectricityBill > 2000 || avgMonthlyMobile > 500) {
    consumptionPattern = "high";
    needLevel = "low";
  } else if (avgElectricityBill > 800 || avgMonthlyMobile > 200) {
    consumptionPattern = "medium";
    needLevel = "medium";
  }
  
  // Calculate income stability (based on data consistency)
  const incomeStability = Math.min(consumptionData.length / 12, 1); // More data = more stability
  
  // Calculate income score
  let score = 50; // Base score
  
  // Lower income = higher score for concessional lending
  if (estimatedIncome > 0) {
    if (estimatedIncome < 15000) score += 20; // Very low income
    else if (estimatedIncome < 25000) score += 10; // Low income
    else if (estimatedIncome > 50000) score -= 20; // High income (less need)
  }
  
  // Stability bonus
  score += incomeStability * 20;
  
  // Data availability bonus
  score += Math.min(consumptionData.length * 2, 10);
  
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    score,
    needLevel,
    indicators: {
      estimatedMonthlyIncome: estimatedIncome > 0 ? Math.round(estimatedIncome) : undefined,
      incomeStability: Math.round(incomeStability * 100) / 100,
      consumptionPattern,
    },
  };
}

// Helper function to determine risk band
function determineRiskBand(repaymentScore: number, incomeScore: number, needLevel: string) {
  const isLowRisk = repaymentScore >= 70;
  const isHighNeed = needLevel === "high" || incomeScore >= 60;
  
  if (isLowRisk && isHighNeed) return "Low Risk-High Need";
  if (isLowRisk && !isHighNeed) return "Low Risk-Low Need";
  if (!isLowRisk && isHighNeed) return "High Risk-High Need";
  return "High Risk-Low Need";
}

// Helper function to generate model explanation
function generateModelExplanation(repaymentScore: any, incomeScore: any) {
  const explanations = [];
  
  // Repayment factors
  if (repaymentScore.components.onTimePayments > 0) {
    const impact = (repaymentScore.components.onTimePayments / repaymentScore.components.totalPayments) * 40 - 20;
    explanations.push({
      factor: "On-time Payment Ratio",
      impact: Math.round(impact),
      description: `${repaymentScore.components.onTimePayments}/${repaymentScore.components.totalPayments} payments made on time`,
    });
  }
  
  if (repaymentScore.components.npaHistory) {
    explanations.push({
      factor: "NPA History",
      impact: -25,
      description: "Previous loan(s) classified as Non-Performing Asset",
    });
  }
  
  if (repaymentScore.utilization.repeatBorrower) {
    explanations.push({
      factor: "Repeat Borrower",
      impact: 10,
      description: `Has taken ${repaymentScore.utilization.totalLoansCount} loans previously`,
    });
  }
  
  // Income factors
  if (incomeScore.indicators.estimatedMonthlyIncome) {
    const income = incomeScore.indicators.estimatedMonthlyIncome;
    let impact = 0;
    let description = "";
    
    if (income < 15000) {
      impact = 20;
      description = "Very low estimated income indicates high need for concessional lending";
    } else if (income < 25000) {
      impact = 10;
      description = "Low estimated income indicates need for concessional lending";
    } else if (income > 50000) {
      impact = -20;
      description = "High estimated income indicates lower need for concessional lending";
    }
    
    if (impact !== 0) {
      explanations.push({
        factor: "Estimated Income Level",
        impact,
        description,
      });
    }
  }
  
  explanations.push({
    factor: "Data Availability",
    impact: Math.min(incomeScore.indicators.incomeStability * 20, 10),
    description: `Income verification data available for ${Math.round(incomeScore.indicators.incomeStability * 12)} months`,
  });
  
  return explanations;
}

// Query to get credit scores with filters
export const getCreditScores = query({
  args: {
    riskBand: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("creditScores");
    
    if (args.riskBand) {
      query = query.filter((q) => q.eq(q.field("riskBand"), args.riskBand));
    }
    
    if (args.minScore !== undefined) {
      query = query.filter((q) => q.gte(q.field("compositeScore"), args.minScore!));
    }
    
    if (args.maxScore !== undefined) {
      query = query.filter((q) => q.lte(q.field("compositeScore"), args.maxScore!));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

// Query to get credit scores by beneficiary ID
export const getCreditScoresByBeneficiary = query({
  args: {
    beneficiaryId: v.string(),
  },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("creditScores")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .order("desc")
      .collect();
    
    return scores;
  },
});

// Query to get credit score analytics
export const getCreditScoreAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const scores = await ctx.db.query("creditScores").collect();
    
    const analytics = {
      totalScores: scores.length,
      averageScore: 0,
      riskBandDistribution: {} as Record<string, number>,
      scoreDistribution: {
        "0-20": 0,
        "21-40": 0,
        "41-60": 0,
        "61-80": 0,
        "81-100": 0,
      },
      monthlyTrends: {} as Record<string, number>,
    };
    
    if (scores.length > 0) {
      analytics.averageScore = Math.round(
        scores.reduce((sum, s) => sum + s.compositeScore, 0) / scores.length
      );
      
      scores.forEach(score => {
        // Risk band distribution
        analytics.riskBandDistribution[score.riskBand] = 
          (analytics.riskBandDistribution[score.riskBand] || 0) + 1;
        
        // Score distribution
        if (score.compositeScore <= 20) analytics.scoreDistribution["0-20"]++;
        else if (score.compositeScore <= 40) analytics.scoreDistribution["21-40"]++;
        else if (score.compositeScore <= 60) analytics.scoreDistribution["41-60"]++;
        else if (score.compositeScore <= 80) analytics.scoreDistribution["61-80"]++;
        else analytics.scoreDistribution["81-100"]++;
        
        // Monthly trends
        const month = new Date(score.calculatedAt).toISOString().slice(0, 7);
        analytics.monthlyTrends[month] = (analytics.monthlyTrends[month] || 0) + 1;
      });
    }
    
    return analytics;
  },
});
