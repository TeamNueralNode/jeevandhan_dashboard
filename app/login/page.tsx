"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Database, Users, TrendingUp, ArrowLeft } from "lucide-react";

export default function LoginPage() {
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
  
  const verifyRole = useMutation(api.roles.verifyRoleCredentials);
  const initializeCompleteData = useMutation(api.initializeData.initializeCompleteData);
  
  const [isInitializing, setIsInitializing] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError("");
      
      if (!roleId || !password) {
        setError("Please enter both role ID and password");
        return;
      }

      try {
        const result = await verifyRole({ roleId, password });
        
        if (result.success && result.role) {
          await login(roleId, password);
          router.replace('/dashboard');
        } else {
          setError(result.message || "Invalid credentials. Please try again.");
        }
      } catch (err) {
        console.error("Verify role error:", err);
        setError(err instanceof Error ? err.message : "Failed to verify credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleFillAdminCredentials = () => {
    setRoleId("admin");
    setPassword("admin123");
    setError("");
  };

  const handleInitializeDemoData = async () => {
    try {
      setIsInitializing(true);
      setError("");
      await initializeCompleteData({ forceReset: true });
      alert("Demo data initialized successfully! You can now log in with admin/admin123");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize demo data");
    } finally {
      setIsInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/home")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jeevandhan Dashboard</h1>
              <p className="text-sm text-gray-600">NBCFDC Credit Scoring System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="roleId" className="text-sm font-medium text-gray-700">
                    Role ID
                  </label>
                  <Input
                    id="roleId"
                    type="text"
                    placeholder="Enter your role ID"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 border-t pt-6">
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-3 text-center">Demo Credentials:</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFillAdminCredentials}
                  className="w-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
                >
                  Fill Admin Credentials
                </Button>
              </div>
              <div className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleInitializeDemoData}
                  disabled={isInitializing}
                  className="w-full"
                >
                  {isInitializing ? "Initializing..." : "Initialize Demo Data"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-none">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Welcome to Jeevandhan</CardTitle>
                <CardDescription className="text-blue-100">
                  AI-Powered Credit Scoring for Financial Inclusion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 flex-shrink-0 text-blue-200" />
                  <div>
                    <h3 className="font-semibold mb-1">Rapid Processing</h3>
                    <p className="text-sm text-blue-100">
                      85% reduction in processing time with same-day approvals
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="h-6 w-6 flex-shrink-0 text-blue-200" />
                  <div>
                    <h3 className="font-semibold mb-1">Alternative Data</h3>
                    <p className="text-sm text-blue-100">
                      Leverages utility bills and consumption patterns for fair assessment
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 flex-shrink-0 text-blue-200" />
                  <div>
                    <h3 className="font-semibold mb-1">Community Focus</h3>
                    <p className="text-sm text-blue-100">
                      Designed for SC/ST/OBC communities under NBCFDC
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-600">Full system access</p>
                  </div>
                  <code className="text-xs bg-white px-2 py-1 rounded border">admin / admin123</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Field Officer</p>
                    <p className="text-xs text-gray-600">Application review</p>
                  </div>
                  <code className="text-xs bg-white px-2 py-1 rounded border">FO-001 / password</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Beneficiary</p>
                    <p className="text-xs text-gray-600">Upload & track</p>
                  </div>
                  <code className="text-xs bg-white px-2 py-1 rounded border">BEN-001 / password</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
