"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Database, Users, TrendingUp } from "lucide-react";

export default function Home() {
  console.log("Login page mounted");
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuth();
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  // Debug: Log when mutation is available
  const verifyRole = useMutation(api.roles.verifyRoleCredentials);
  const initializeCompleteData = useMutation(api.initializeData.initializeCompleteData);
  console.log("Verify role mutation available:", !!verifyRole);
  
  const [isInitializing, setIsInitializing] = useState(false);

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
          console.log("Login successful, storing user data and redirecting to dashboard");
          // Call the auth context login to store user data
          await login(roleId.trim(), password.trim());
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

  const handleInitializeDemo = async () => {
    try {
      setIsInitializing(true);
      setError("");
      
      console.log("Resetting and initializing comprehensive demo data...");
      const result = await initializeCompleteData({ forceReset: true });
      console.log("Complete data initialized:", result);
      
      if (result?.success) {
        setError(`Demo data initialized successfully! Created: ${result.counts?.beneficiaries || 0} beneficiaries, ${result.counts?.applications || 0} applications, ${result.counts?.creditScores || 0} credit scores. You can now login with 'admin' / 'admin'`);
      } else {
        setError(result?.message || "Demo data initialization completed");
      }
    } catch (err) {
      console.error("Demo initialization error:", err);
      setError("Failed to initialize demo data. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              NBCFDC Credit Scoring Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Beneficiary Credit Scoring with Income Verification Layer for Direct Digital Lending
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold">Beneficiaries</div>
                <div className="text-sm text-gray-600">Manage profiles</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold">Credit Scoring</div>
                <div className="text-sm text-gray-600">AI/ML based</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Database className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-semibold">Digital Lending</div>
                <div className="text-sm text-gray-600">Auto approval</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Key Features:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Historical repayment behavior analysis</li>
              <li>• Income verification through consumption patterns</li>
              <li>• Composite credit scoring with risk bands</li>
              <li>• Same-day loan approval for eligible beneficiaries</li>
              <li>• Transparent and explainable AI models</li>
            </ul>
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Demo Data
              </CardTitle>
              <CardDescription>
                Initialize sample beneficiaries, loans, and credit scores for demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleInitializeDemo}
                disabled={isInitializing}
                className="w-full"
                variant="outline"
              >
                {isInitializing ? "Initializing..." : "Initialize Demo Data"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Login */}
        <Card className="w-full max-w-md mx-auto">
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
    </div>
  );
}
