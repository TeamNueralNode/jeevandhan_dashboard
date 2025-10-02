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

  const handleFillAdminCredentials = () => {
    setRoleId("admin");
    setPassword("admin");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start lg:items-center">
        {/* Left side - Information */}
        <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              NBCFDC Credit Scoring Dashboard
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">
              Beneficiary Credit Scoring with Income Verification Layer for Direct Digital Lending
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Beneficiaries</div>
                <div className="text-xs sm:text-sm text-gray-600">Manage profiles</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Credit Scoring</div>
                <div className="text-xs sm:text-sm text-gray-600">AI/ML based</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Digital Lending</div>
                <div className="text-xs sm:text-sm text-gray-600">Auto approval</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Key Features:</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li>• Historical repayment behavior analysis</li>
              <li>• Income verification through consumption patterns</li>
              <li>• Composite credit scoring with risk bands</li>
              <li>• Same-day loan approval for eligible beneficiaries</li>
              <li>• Transparent and explainable AI models</li>
            </ul>
          </div>
          
          <Card className="bg-blue-50 border-blue-200 hidden sm:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-900 flex items-center text-base sm:text-lg">
                <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Demo Data
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Initialize sample beneficiaries, loans, and credit scores for demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleInitializeDemo}
                disabled={isInitializing}
                className="w-full text-sm"
                variant="outline"
              >
                {isInitializing ? "Initializing..." : "Initialize Demo Data"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Login */}
        <Card className="w-full max-w-md mx-auto order-1 lg:order-2">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Login to your account</CardTitle>
          {error && (
            <CardDescription className="text-red-500 text-xs sm:text-sm">{error}</CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label htmlFor="roleId" className="text-xs sm:text-sm font-medium">Role ID</label>
              <Input 
                id="roleId" 
                placeholder="admin" 
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required 
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="pt-1 pb-2 sm:pt-2">
              <Button 
                type="button"
                size="sm"
                onClick={handleFillAdminCredentials}
                className="w-full text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0 font-semibold"
              >
                ✨ Use Admin Credentials (admin/admin)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:space-y-4">
            <Button 
              type="submit" 
              className="w-full text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex justify-between w-full text-xs sm:text-sm">
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
        
        {/* Mobile-only Demo Data Button */}
        <Card className="bg-blue-50 border-blue-200 sm:hidden order-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 flex items-center text-base">
              <Database className="h-4 w-4 mr-2" />
              Demo Data
            </CardTitle>
            <CardDescription className="text-xs">
              Initialize sample data for demonstration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInitializeDemo}
              disabled={isInitializing}
              className="w-full text-sm"
              variant="outline"
            >
              {isInitializing ? "Initializing..." : "Initialize Demo Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
