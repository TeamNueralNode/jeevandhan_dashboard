"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Clock,
  Target,
  BarChart3,
  ArrowRight,
  Play,
  FileText,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Jeevandhan Dashboard
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-blue-100">
              NBCFDC Credit Scoring & Digital Lending System
            </p>
            <p className="text-lg sm:text-xl mb-8 text-blue-200 max-w-3xl mx-auto">
              Empowering financial inclusion through AI-driven credit assessment for
              marginalized communities
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => setShowDemo(!showDemo)}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Challenge
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional credit assessment systems fail to serve marginalized communities,
            leaving millions without access to essential financial services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-red-500">
            <CardHeader>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Slow Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manual verification processes take weeks or months, delaying critical
                financial assistance to those who need it most
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-orange-500">
            <CardHeader>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Limited Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Lack of formal financial history makes it difficult to assess
                creditworthiness for SC/ST/OBC communities
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-yellow-500">
            <CardHeader>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">High Risk Perception</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Traditional models incorrectly categorize these communities as high-risk,
                preventing access to credit
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Solution Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              An AI-powered credit scoring system that leverages alternative data sources
              to enable rapid, fair lending decisions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Alternative Data Integration
                  </h3>
                  <p className="text-gray-600">
                    Uses electricity bills, mobile recharges, and utility payments to verify
                    income and assess creditworthiness
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Dual-Component Scoring
                  </h3>
                  <p className="text-gray-600">
                    60% repayment history + 40% income indicators = comprehensive,
                    fair assessment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Four-Tier Risk Banding
                  </h3>
                  <p className="text-gray-600">
                    Prioritizes &ldquo;Low Risk-High Need&rdquo; applicants for immediate support while
                    maintaining prudent lending standards
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Same-Day Auto-Approval
                  </h3>
                  <p className="text-gray-600">
                    High-scoring applicants receive instant approval, dramatically reducing
                    processing time from weeks to hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-700">
                    Beneficiary submits loan application with basic details
                  </p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-700">
                    System fetches consumption data and repayment history
                  </p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-700">
                    AI model calculates composite credit score (0-100)
                  </p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-700">
                    Risk band assigned based on score and need assessment
                  </p>
                </div>
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <p className="text-gray-700">
                    Eligible applications auto-approved; others reviewed manually
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Real Impact
          </h2>
          <p className="text-xl text-gray-600">
            Transforming financial access for marginalized communities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold text-blue-900 mb-2">85%</p>
              <p className="text-gray-700 font-medium">Processing Time Reduction</p>
              <p className="text-sm text-gray-600 mt-2">From weeks to hours</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold text-green-900 mb-2">65%</p>
              <p className="text-gray-700 font-medium">Same-Day Sanctions</p>
              <p className="text-sm text-gray-600 mt-2">Instant approvals</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold text-purple-900 mb-2">100%</p>
              <p className="text-gray-700 font-medium">Income Verification</p>
              <p className="text-sm text-gray-600 mt-2">Alternative data coverage</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold text-orange-900 mb-2">4-Tier</p>
              <p className="text-gray-700 font-medium">Risk Classification</p>
              <p className="text-sm text-gray-600 mt-2">Prioritized lending</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Comprehensive Analytics</CardTitle>
                <CardDescription>
                  Real-time dashboard with KPIs, risk distribution, and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-green-600 mb-3" />
                <CardTitle>Score Explainability</CardTitle>
                <CardDescription>
                  Transparent breakdown showing how each factor influences credit scores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-purple-600 mb-3" />
                <CardTitle>Consumption Upload</CardTitle>
                <CardDescription>
                  Easy interface for beneficiaries to submit utility bills and proofs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-orange-600 mb-3" />
                <CardTitle>Compliance & Audit</CardTitle>
                <CardDescription>
                  Complete audit trail for regulatory compliance and transparency
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-3" />
                <CardTitle>Auto-Approval Engine</CardTitle>
                <CardDescription>
                  AI-powered instant decisions for high-score, low-risk applicants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-red-600 mb-3" />
                <CardTitle>Real-Time Processing</CardTitle>
                <CardDescription>
                  Instant credit score calculation with serverless backend architecture
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">System Demo Walkthrough</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDemo(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span>Login & Dashboard</span>
                </h3>
                <p className="text-gray-600 ml-10">
                  Access the system as Admin, Field Officer, or Beneficiary. View
                  comprehensive dashboard with key metrics, applications, and analytics.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span>Upload Consumption Data</span>
                </h3>
                <p className="text-gray-600 ml-10">
                  Beneficiaries submit electricity bills, mobile recharges, and utility
                  payments through an intuitive form with validation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span>Credit Score Calculation</span>
                </h3>
                <p className="text-gray-600 ml-10">
                  AI model analyzes repayment history (60%) and income indicators (40%) to
                  generate a composite score and assign risk band.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <span>View Explainability</span>
                </h3>
                <p className="text-gray-600 ml-10">
                  Detailed breakdown shows factor importance, impact analysis, and audit
                  trail for complete transparency.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <span>Digital Lending Decision</span>
                </h3>
                <p className="text-gray-600 ml-10">
                  High-score applications receive automatic approval. Manual review cases
                  are flagged for officer assessment.
                </p>
              </div>

              <div className="pt-6 border-t">
                <Button
                  onClick={() => {
                    setShowDemo(false);
                    router.push("/login");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Financial Inclusion?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join us in empowering marginalized communities with fair, rapid access to credit
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
            >
              Access Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 Jeevandhan Dashboard - NBCFDC Credit Scoring System
            </p>
            <p className="text-xs mt-2">
              Ministry of Social Justice & Empowerment | Problem Statement #25150
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
