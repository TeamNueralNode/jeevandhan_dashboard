import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upload consumption data for income verification
export const uploadConsumptionData = mutation({
  args: {
    beneficiaryId: v.string(),
    dataType: v.string(), // "electricity", "mobile", "utility", "survey"
    dataSource: v.string(),
    monthYear: v.string(), // "2024-01" format
    metrics: v.object({
      electricityUnits: v.optional(v.number()),
      electricityBill: v.optional(v.number()),
      mobileRecharges: v.optional(v.array(v.object({
        amount: v.number(),
        date: v.number(),
      }))),
      utilityBills: v.optional(v.array(v.object({
        type: v.string(),
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
  },
  handler: async (ctx, args) => {
    // Verify beneficiary exists
    const beneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }
    
    // Check if data for this month already exists
    const existing = await ctx.db
      .query("consumptionData")
      .filter((q) => 
        q.and(
          q.eq(q.field("beneficiaryId"), args.beneficiaryId),
          q.eq(q.field("dataType"), args.dataType),
          q.eq(q.field("monthYear"), args.monthYear)
        )
      )
      .first();
    
    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        metrics: args.metrics,
        dataSource: args.dataSource,
        uploadedBy: args.uploadedBy,
        verificationStatus: "pending",
        createdAt: Date.now(),
      });
      
      return existing._id;
    } else {
      // Create new record
      const dataId = `DATA_${args.beneficiaryId}_${args.dataType}_${args.monthYear}`;
      
      return await ctx.db.insert("consumptionData", {
        dataId,
        beneficiaryId: args.beneficiaryId,
        dataType: args.dataType,
        dataSource: args.dataSource,
        monthYear: args.monthYear,
        metrics: args.metrics,
        uploadedBy: args.uploadedBy,
        verificationStatus: "pending",
        createdAt: Date.now(),
      });
    }
  },
});

// Get consumption data for a beneficiary
export const getConsumptionData = query({
  args: {
    beneficiaryId: v.string(),
    dataType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("consumptionData")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId));
    
    if (args.dataType) {
      query = query.filter((q) => q.eq(q.field("dataType"), args.dataType));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 12); // Default to last 12 months
  },
});

// Verify consumption data
export const verifyConsumptionData = mutation({
  args: {
    dataId: v.string(),
    verificationStatus: v.string(), // "verified", "rejected"
    verifiedBy: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("consumptionData")
      .filter((q) => q.eq(q.field("dataId"), args.dataId))
      .first();
    
    if (!data) {
      throw new Error("Consumption data not found");
    }
    
    await ctx.db.patch(data._id, {
      verificationStatus: args.verificationStatus,
      // Add verification metadata if needed
    });
    
    return { success: true };
  },
});

// Bulk upload consumption data (for channel partners)
export const bulkUploadConsumptionData = mutation({
  args: {
    dataRecords: v.array(v.object({
      beneficiaryId: v.string(),
      dataType: v.string(),
      dataSource: v.string(),
      monthYear: v.string(),
      metrics: v.object({
        electricityUnits: v.optional(v.number()),
        electricityBill: v.optional(v.number()),
        mobileRecharges: v.optional(v.array(v.object({
          amount: v.number(),
          date: v.number(),
        }))),
        utilityBills: v.optional(v.array(v.object({
          type: v.string(),
          amount: v.number(),
          date: v.number(),
        }))),
        surveyData: v.optional(v.object({
          householdIncome: v.optional(v.number()),
          assets: v.optional(v.array(v.string())),
          expenses: v.optional(v.number()),
        })),
      }),
    })),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const record of args.dataRecords) {
      try {
        // Verify beneficiary exists
        const beneficiary = await ctx.db
          .query("beneficiaries")
          .filter((q) => q.eq(q.field("beneficiaryId"), record.beneficiaryId))
          .first();
        
        if (!beneficiary) {
          results.push({
            beneficiaryId: record.beneficiaryId,
            status: "error",
            message: "Beneficiary not found",
          });
          continue;
        }
        
        const dataId = `DATA_${record.beneficiaryId}_${record.dataType}_${record.monthYear}`;
        
        // Check if data already exists
        const existing = await ctx.db
          .query("consumptionData")
          .filter((q) => q.eq(q.field("dataId"), dataId))
          .first();
        
        if (existing) {
          // Update existing
          await ctx.db.patch(existing._id, {
            metrics: record.metrics,
            dataSource: record.dataSource,
            uploadedBy: args.uploadedBy,
            verificationStatus: "pending",
            createdAt: Date.now(),
          });
          
          results.push({
            beneficiaryId: record.beneficiaryId,
            status: "updated",
            dataId: existing.dataId,
          });
        } else {
          // Create new
          await ctx.db.insert("consumptionData", {
            dataId,
            beneficiaryId: record.beneficiaryId,
            dataType: record.dataType,
            dataSource: record.dataSource,
            monthYear: record.monthYear,
            metrics: record.metrics,
            uploadedBy: args.uploadedBy,
            verificationStatus: "pending",
            createdAt: Date.now(),
          });
          
          results.push({
            beneficiaryId: record.beneficiaryId,
            status: "created",
            dataId,
          });
        }
      } catch (error) {
        results.push({
          beneficiaryId: record.beneficiaryId,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    
    return {
      totalRecords: args.dataRecords.length,
      successful: results.filter(r => r.status !== "error").length,
      failed: results.filter(r => r.status === "error").length,
      results,
    };
  },
});

// Get consumption data analytics
export const getConsumptionAnalytics = query({
  args: {
    beneficiaryId: v.optional(v.string()),
    dataType: v.optional(v.string()),
    fromMonth: v.optional(v.string()),
    toMonth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("consumptionData");
    
    if (args.beneficiaryId) {
      query = query.filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId));
    }
    
    if (args.dataType) {
      query = query.filter((q) => q.eq(q.field("dataType"), args.dataType));
    }
    
    const data = await query.collect();
    
    const analytics = {
      totalRecords: data.length,
      byDataType: {} as Record<string, number>,
      byVerificationStatus: {} as Record<string, number>,
      monthlyTrends: {} as Record<string, number>,
      averageElectricityBill: 0,
      averageMobileSpend: 0,
      incomeEstimates: [] as number[],
    };
    
    let totalElectricityBill = 0;
    let electricityCount = 0;
    let totalMobileSpend = 0;
    let mobileCount = 0;
    
    data.forEach(record => {
      // Count by data type
      analytics.byDataType[record.dataType] = (analytics.byDataType[record.dataType] || 0) + 1;
      
      // Count by verification status
      analytics.byVerificationStatus[record.verificationStatus] = 
        (analytics.byVerificationStatus[record.verificationStatus] || 0) + 1;
      
      // Monthly trends
      analytics.monthlyTrends[record.monthYear] = (analytics.monthlyTrends[record.monthYear] || 0) + 1;
      
      // Calculate averages
      if (record.dataType === "electricity" && record.metrics.electricityBill) {
        totalElectricityBill += record.metrics.electricityBill;
        electricityCount++;
      }
      
      if (record.dataType === "mobile" && record.metrics.mobileRecharges) {
        const monthlyMobile = record.metrics.mobileRecharges.reduce((sum, r) => sum + r.amount, 0);
        totalMobileSpend += monthlyMobile;
        mobileCount++;
      }
      
      // Estimate income based on consumption
      if (record.metrics.surveyData?.householdIncome) {
        analytics.incomeEstimates.push(record.metrics.surveyData.householdIncome);
      }
    });
    
    analytics.averageElectricityBill = electricityCount > 0 ? 
      Math.round(totalElectricityBill / electricityCount) : 0;
    analytics.averageMobileSpend = mobileCount > 0 ? 
      Math.round(totalMobileSpend / mobileCount) : 0;
    
    return analytics;
  },
});
