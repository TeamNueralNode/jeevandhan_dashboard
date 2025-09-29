import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  roles: defineTable({
    roleId: v.string(),
    password: v.string(),
    roleName: v.string(),
    permissions: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_roleId", ["roleId"]),
});