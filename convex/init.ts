import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Initialize admin user
export const initAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if admin exists
      const existing = await ctx.db
        .query("roles")
        .filter((q) => q.eq(q.field("roleId"), "admin"))
        .first();

      if (existing) {
        console.log("Admin role already exists");
        return {
          status: "exists",
          role: {
            roleId: existing.roleId,
            roleName: existing.roleName,
            createdAt: new Date(existing.createdAt).toISOString(),
          },
        };
      }

      // Create admin role if it doesn't exist
      const roleId = await ctx.db.insert("roles", {
        roleId: "admin",
        password: "admin", // In production, this should be hashed
        roleName: "Administrator",
        permissions: ["all"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      console.log("Created new admin role");
      return {
        status: "created",
        roleId,
      };
    } catch (error) {
      console.error("Error in initAdmin:", error);
      throw error;
    }
  },
});