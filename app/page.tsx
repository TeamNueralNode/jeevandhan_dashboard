"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function Home() {
  console.log("Login page mounted");
  const router = useRouter();
  const { login, loading } = useAuth();
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Debug: Log when mutation is available
  const verifyRole = useMutation(api.roles.verifyRoleCredentials);
  console.log("Verify role mutation available:", !!verifyRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with roleId:", roleId);
    
    try {
      setError("");
      
      if (!roleId || !password) {
        const errorMsg = "Please enter both role ID and password";
        console.log("Validation error:", errorMsg);
        setError(errorMsg);
        return;
      }

      console.log("Attempting to verify role...");
      try {
        // Debug log before mutation
        console.log("Calling verifyRole mutation with:", { roleId, password });
        
        // Ensure both roleId and password are passed to the mutation
        const result = await verifyRole({ 
          roleId: roleId.trim(),
          password: password.trim()
        });
        console.log("Verify role result:", result);
        
        if (result?.success) {
          console.log("Login successful, redirecting to dashboard");
          router.replace("/dashboard");
        } else {
          const errorMsg = result?.message || "Invalid credentials";
          console.log("Login failed:", errorMsg);
          setError(errorMsg);
        }
      } catch (convexError) {
        console.error("Convex mutation error:", convexError);
        setError("Authentication service unavailable. Please try again later.");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          {error && (
            <CardDescription className="text-red-500">{error}</CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roleId" className="text-sm font-medium">Role ID</label>
              <Input 
                id="roleId" 
                placeholder="admin" 
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex justify-between w-full text-sm">
              <a href="/signup" className="text-blue-500 hover:underline">
                Create account
              </a>
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
