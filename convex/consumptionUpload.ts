import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Upload consumption data with details
export const uploadConsumptionData = mutation({
  args: {
    beneficiaryId: v.string(),
    dataType: v.string(),
    monthYear: v.string(),
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
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const dataId = `CONS-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const metrics: {
      electricityUnits?: number;
      electricityBill?: number;
      mobileRecharges?: Array<{ amount: number; date: number }>;
      utilityBills?: Array<{ type: string; amount: number; date: number }>;
    } = {};

    if (args.electricityUnits !== undefined) metrics.electricityUnits = args.electricityUnits;
    if (args.electricityBill !== undefined) metrics.electricityBill = args.electricityBill;
    if (args.mobileRecharges !== undefined) metrics.mobileRecharges = args.mobileRecharges;
    if (args.utilityBills !== undefined) metrics.utilityBills = args.utilityBills;

    const consumptionDataId = await ctx.db.insert("consumptionData", {
      dataId,
      beneficiaryId: args.beneficiaryId,
      dataType: args.dataType,
      dataSource: "beneficiary_upload",
      monthYear: args.monthYear,
      metrics,
      uploadedBy: args.uploadedBy,
      verificationStatus: "pending",
      createdAt: Date.now(),
    });

    return { success: true, dataId, consumptionDataId };
  },
});

// Store document metadata (in real app, you'd upload to storage first)
export const uploadConsumptionDocument = mutation({
  args: {
    beneficiaryId: v.string(),
    consumptionDataId: v.string(),
    documentType: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    storageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const documentId = `DOC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const docId = await ctx.db.insert("consumptionDocuments", {
      documentId,
      beneficiaryId: args.beneficiaryId,
      consumptionDataId: args.consumptionDataId,
      documentType: args.documentType,
      fileName: args.fileName,
      fileSize: args.fileSize,
      fileType: args.fileType,
      storageUrl: args.storageUrl,
      uploadDate: Date.now(),
      verificationStatus: "pending",
      createdAt: Date.now(),
    });

    return { success: true, documentId, docId };
  },
});

// Get consumption data for a beneficiary
export const getConsumptionData = query({
  args: {
    beneficiaryId: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("consumptionData")
      .withIndex("by_beneficiaryId", (q) => q.eq("beneficiaryId", args.beneficiaryId))
      .collect();
    
    return data.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get consumption documents for a beneficiary
export const getConsumptionDocuments = query({
  args: {
    beneficiaryId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("consumptionDocuments")
      .withIndex("by_beneficiaryId", (q) => q.eq("beneficiaryId", args.beneficiaryId))
      .collect();
    
    return documents.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all consumption data with pagination
export const getAllConsumptionData = query({
  args: {
    paginationOpts: v.optional(v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    })),
  },
  handler: async (ctx, args) => {
    const paginationOpts = args.paginationOpts || { numItems: 50, cursor: null };
    return await ctx.db
      .query("consumptionData")
      .order("desc")
      .paginate(paginationOpts);
  },
});

// Verify consumption data (admin function)
export const verifyConsumptionData = mutation({
  args: {
    dataId: v.string(),
    verificationStatus: v.string(),
    verifiedBy: v.string(),
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
    });

    return { success: true };
  },
});
