import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get role by roleId
export const getRoleByRoleId = query({
  args: { roleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("roleId"), args.roleId))
      .first();
  }
});

// Mutation to initialize admin role
export const initializeAdminRole = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if admin role already exists
    const existing = await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("roleId"), "admin"))
      .first();

    if (existing) {
      return existing._id; // Role already exists
    }

    // Create admin role
    const roleId = await ctx.db.insert("roles", {
      roleId: "admin",
      password: "admin", // In production, this should be hashed
      roleName: "Administrator",
      permissions: ["all"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return roleId;
  }
});

// Mutation to verify role credentials
export const verifyRoleCredentials = mutation({
  args: {
    roleId: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    try {
      console.log("Verifying credentials for roleId:", args.roleId);
      
      const role = await ctx.db
        .query("roles")
        .filter((q) => q.eq(q.field("roleId"), args.roleId))
        .first();

      if (!role) {
        console.log("Role not found:", args.roleId);
        return { success: false, message: "Role not found" };
      }

      console.log("Role found, comparing passwords");
      // Direct comparison for now (we'll implement proper hashing later)
      const isValidPassword = args.password === role.password;
      
      if (!isValidPassword) {
        console.log("Invalid password for role:", args.roleId);
        return { success: false, message: "Invalid credentials" };
      }

      console.log("Login successful for role:", args.roleId);
      return {
        success: true,
        role: {
          roleId: role.roleId,
          roleName: role.roleName,
          permissions: role.permissions
        }
      };
    } catch (error) {
      console.error("Error in verifyRoleCredentials:", error);
      return { success: false, message: "An error occurred during authentication" };
    }
  }
});