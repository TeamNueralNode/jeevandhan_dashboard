"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportScoreExplanationToPDF } from "@/lib/export-utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Shield,
  Calendar,
  User,
  Download,
} from "lucide-react";

export default function ExplainabilityPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [beneficiaryId, setBeneficiaryId] = useState<string>("");

  // Fetch data
  const creditScores = useQuery(
    api.creditScoring.getCreditScoresByBeneficiary,
    beneficiaryId ? { beneficiaryId } : "skip"
  );
  
  const beneficiaryData = useQuery(
    api.beneficiaries.getBeneficiaryProfile,
    beneficiaryId ? { beneficiaryId } : "skip"
  );

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

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  const latestScore = creditScores?.[0];
  const scoreHistory = creditScores || [];
  const beneficiary = beneficiaryData?.beneficiary;

  const handleExportPDF = () => {
    if (!latestScore || !beneficiary) {
      toast.error("No data available to export");
      return;
    }

    try {
      exportScoreExplanationToPDF({
        beneficiaryId: beneficiary.beneficiaryId,
        beneficiaryName: beneficiary.name,
        compositeScore: latestScore.compositeScore,
        repaymentScore: latestScore.repaymentScore,
        incomeScore: latestScore.incomeScore,
        riskBand: latestScore.riskBand,
        calculatedAt: latestScore.calculatedAt,
        factors: latestScore.modelExplanation,
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    }
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getRiskBandColor = (riskBand: string) => {
    if (riskBand.includes("Low Risk-High Need")) return "text-green-700 bg-green-100";
    if (riskBand.includes("Low Risk-Low Need")) return "text-blue-700 bg-blue-100";
    if (riskBand.includes("Medium Risk")) return "text-yellow-700 bg-yellow-100";
    return "text-red-700 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Credit Score Explainability</h1>
                <p className="text-sm text-gray-600">Understand how credit scores are calculated</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {beneficiary && latestScore && (
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </Button>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Logged in as:</span>
                <span className="font-semibold text-blue-600">{user?.roleId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Select Beneficiary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                  placeholder="Enter Beneficiary ID (e.g., BEN-001)"
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => {
                  // Trigger re-fetch by just using current beneficiaryId state
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Explanation
              </Button>
            </div>
          </CardContent>
        </Card>

        {beneficiary && latestScore && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Score Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Beneficiary Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Beneficiary Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{beneficiary.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-mono text-sm">{beneficiary.beneficiaryId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{beneficiary.demographicInfo.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      beneficiary.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {beneficiary.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Score Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Credit Score</CardTitle>
                  <CardDescription>Latest assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Composite Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Composite Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(latestScore.compositeScore)}`}>
                      {latestScore.compositeScore}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">out of 100</p>
                  </div>

                  {/* Risk Band */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Risk Band</p>
                    <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${getRiskBandColor(latestScore.riskBand)}`}>
                      {latestScore.riskBand}
                    </span>
                  </div>

                  {/* Component Scores */}
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Repayment Score</span>
                        <span className={`font-semibold ${getScoreColor(latestScore.repaymentScore)}`}>
                          {latestScore.repaymentScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBgColor(latestScore.repaymentScore)}`}
                          style={{ width: `${latestScore.repaymentScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Income Score</span>
                        <span className={`font-semibold ${getScoreColor(latestScore.incomeScore)}`}>
                          {latestScore.incomeScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBgColor(latestScore.incomeScore)}`}
                          style={{ width: `${latestScore.incomeScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Date */}
                  <div className="pt-4 border-t flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Calculated</span>
                    </div>
                    <span>{new Date(latestScore.calculatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Explanation */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Score Calculation Breakdown</span>
                  </CardTitle>
                  <CardDescription>
                    Composite Score = (Repayment Score × 60%) + (Income Score × 40%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Visual Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Repayment Score</span>
                        <span className="text-2xl font-bold text-blue-600">{latestScore.repaymentScore}</span>
                      </div>
                      <div className="text-xs text-blue-700 mb-2">Weight: 60%</div>
                      <div className="text-sm font-semibold text-blue-900">
                        Contribution: {Math.round(latestScore.repaymentScore * 0.6)}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">Income Score</span>
                        <span className="text-2xl font-bold text-purple-600">{latestScore.incomeScore}</span>
                      </div>
                      <div className="text-xs text-purple-700 mb-2">Weight: 40%</div>
                      <div className="text-sm font-semibold text-purple-900">
                        Contribution: {Math.round(latestScore.incomeScore * 0.4)}
                      </div>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden flex">
                    <div
                      className="bg-blue-600 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${(latestScore.repaymentScore * 0.6)}%` }}
                    >
                      {Math.round(latestScore.repaymentScore * 0.6)}
                    </div>
                    <div
                      className="bg-purple-600 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${(latestScore.incomeScore * 0.4)}%` }}
                    >
                      {Math.round(latestScore.incomeScore * 0.4)}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>Repayment (60%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-600 rounded"></div>
                      <span>Income (40%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Factor Impact Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span>Factor Importance & Impact</span>
                  </CardTitle>
                  <CardDescription>
                    Key factors influencing the credit score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {latestScore.modelExplanation.map((factor: { factor: string; impact: number; description: string }, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {factor.impact > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : factor.impact < 0 ? (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-600" />
                              )}
                              <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{factor.description}</p>
                          </div>
                          <div className="ml-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                factor.impact > 0
                                  ? "bg-green-100 text-green-800"
                                  : factor.impact < 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {factor.impact > 0 ? "+" : ""}{factor.impact}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.impact > 0 ? "bg-green-600" : factor.impact < 0 ? "bg-red-600" : "bg-gray-400"
                            }`}
                            style={{
                              width: `${Math.abs(factor.impact)}%`,
                              marginLeft: factor.impact < 0 ? `${100 - Math.abs(factor.impact)}%` : '0'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Repayment History Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Repayment History Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {latestScore.scoreComponents.repaymentHistory.onTimePayments}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">On-Time Payments</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {latestScore.scoreComponents.repaymentHistory.totalPayments}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Total Payments</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {latestScore.scoreComponents.repaymentHistory.averageDelay} days
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Avg Delay</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {latestScore.scoreComponents.repaymentHistory.npaHistory ? (
                          <XCircle className="h-6 w-6 mx-auto text-red-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 mx-auto text-green-600" />
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">NPA Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Income Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <span>Income Indicators</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Estimated Monthly Income</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{latestScore.scoreComponents.incomeIndicators.estimatedMonthlyIncome?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Income Stability</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(latestScore.scoreComponents.incomeIndicators.incomeStability * 100)}%
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Consumption Pattern</p>
                      <p className="text-lg font-bold text-green-600 capitalize">
                        {latestScore.scoreComponents.incomeIndicators.consumptionPattern}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span>Audit Trail & Compliance</span>
                  </CardTitle>
                  <CardDescription>
                    Score calculation history and model information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Score ID</p>
                      <p className="font-mono text-xs">{latestScore.scoreId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Model Version</p>
                      <p className="font-semibold">{latestScore.scoreVersion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Calculated At</p>
                      <p className="font-medium">
                        {new Date(latestScore.calculatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="font-medium">
                        {new Date(latestScore.validUntil).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Score History */}
                  {scoreHistory.length > 1 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3">Score History</h4>
                      <div className="space-y-2">
                        {scoreHistory.slice(0, 5).map((score: { scoreId: string; compositeScore: number; calculatedAt: number; riskBand: string }, index: number) => (
                          <div
                            key={score.scoreId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-500">#{index + 1}</span>
                              <span className="font-semibold">{score.compositeScore}</span>
                              <span className={`px-2 py-1 rounded text-xs ${getRiskBandColor(score.riskBand)}`}>
                                {score.riskBand}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {new Date(score.calculatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!beneficiary && beneficiaryId && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
              <p className="text-gray-600">
                No credit score data found for beneficiary ID: <span className="font-mono">{beneficiaryId}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please verify the ID and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {!beneficiaryId && (
          <Card>
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">
                Enter a Beneficiary ID above to view detailed credit score explanation
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
