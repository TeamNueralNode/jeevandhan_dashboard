import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Debug mutation to check if admin role exists and create it if not
export const debugInitAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if admin exists
    const existing = await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("roleId"), "admin"))
      .first();

    if (existing) {
      return {
        status: "exists",
        role: {
          roleId: existing.roleId,
          roleName: existing.roleName,
          created: new Date(existing.createdAt).toISOString()
        }
      };
    }

    // Create admin role if it doesn't exist
    const roleId = await ctx.db.insert("roles", {
      roleId: "admin",
      password: "admin",
      roleName: "Administrator",
      permissions: ["all"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      status: "created",
      roleId
    };
  },
});