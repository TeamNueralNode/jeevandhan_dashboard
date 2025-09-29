import { v } from "convex/values";

// Note: In Convex, we need to use its built-in crypto utilities
export async function hashPassword(password: string): Promise<string> {
  // For development, we'll use plain text
  // In production, you should use proper hashing
  return password;
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // For development, we'll do direct comparison
  // In production, you should use proper comparison
  return password === hashedPassword;
}