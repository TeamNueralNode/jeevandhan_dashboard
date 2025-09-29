import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';
import { hashPassword, comparePasswords } from './util';

// Define user table schema
export const schema = {
  users: {
    email: v.string(),
    password: v.string(), // Hashed password
    name: v.optional(v.string()),
    createdAt: v.number(),
  },
};

// Query to get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('roles')
      .filter(q => q.eq(q.field('roleId'), args.email))
      .first();
    
    if (!user) return null;
    
    // Don't return the password hash
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Mutation to create a new user
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query('roles')
      .filter(q => q.eq(q.field('roleId'), args.email))
      .first();
    
    if (existing) {
      throw new ConvexError('User already exists');
    }

    const hashedPassword = await hashPassword(args.password);
    
    const userId = await ctx.db.insert('roles', {
      roleId: args.email,
      password: hashedPassword,
      roleName: args.name || args.email, // Use email as default roleName if name is not provided
      permissions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});