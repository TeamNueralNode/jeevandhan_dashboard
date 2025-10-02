import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get all beneficiaries with pagination
export const getBeneficiaries = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    channelPartner: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("beneficiaries");
    
    if (args.channelPartner) {
      query = query.filter((q) => q.eq(q.field("channelPartner"), args.channelPartner));
    }
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    return await query
      .order("desc")
      .paginate({
        numItems: args.limit || 20,
        cursor: args.cursor || null,
      });
  },
});

// Query to get beneficiary by ID
export const getBeneficiaryById = query({
  args: { beneficiaryId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
  },
});

// Query to get beneficiary with complete profile (loans, repayments, scores)
export const getBeneficiaryProfile = query({
  args: { beneficiaryId: v.string() },
  handler: async (ctx, args) => {
    const beneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (!beneficiary) return null;
    
    // Get loans
    const loans = await ctx.db
      .query("loans")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .collect();
    
    // Get latest credit score
    const latestScore = await ctx.db
      .query("creditScores")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .order("desc")
      .first();
    
    // Get consumption data
    const consumptionData = await ctx.db
      .query("consumptionData")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .order("desc")
      .take(12); // Last 12 months
    
    return {
      beneficiary,
      loans,
      latestScore,
      consumptionData,
    };
  },
});

// Mutation to create a new beneficiary
export const createBeneficiary = mutation({
  args: {
    beneficiaryId: v.string(),
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
      category: v.string(),
      familySize: v.number(),
      occupation: v.string(),
    }),
    kycDocuments: v.object({
      aadhaar: v.optional(v.string()),
      pan: v.optional(v.string()),
      bankAccount: v.optional(v.string()),
    }),
    channelPartner: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if beneficiary already exists
    const existing = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (existing) {
      throw new Error("Beneficiary with this ID already exists");
    }
    
    const now = Date.now();
    
    return await ctx.db.insert("beneficiaries", {
      ...args,
      registrationDate: now,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to update beneficiary status
export const updateBeneficiaryStatus = mutation({
  args: {
    beneficiaryId: v.string(),
    status: v.string(),
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const beneficiary = await ctx.db
      .query("beneficiaries")
      .filter((q) => q.eq(q.field("beneficiaryId"), args.beneficiaryId))
      .first();
    
    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }
    
    await ctx.db.patch(beneficiary._id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Query to get beneficiary statistics
export const getBeneficiaryStats = query({
  args: {
    channelPartner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("beneficiaries");
    
    if (args.channelPartner) {
      query = query.filter((q) => q.eq(q.field("channelPartner"), args.channelPartner));
    }
    
    const beneficiaries = await query.collect();
    
    const stats = {
      total: beneficiaries.length,
      active: beneficiaries.filter(b => b.status === "active").length,
      inactive: beneficiaries.filter(b => b.status === "inactive").length,
      suspended: beneficiaries.filter(b => b.status === "suspended").length,
      byCategory: {} as Record<string, number>,
      byState: {} as Record<string, number>,
    };
    
    // Calculate category and state distributions
    beneficiaries.forEach(b => {
      const category = b.demographicInfo.category;
      const state = b.address.state;
      
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      stats.byState[state] = (stats.byState[state] || 0) + 1;
    });
    
    return stats;
  },
});
