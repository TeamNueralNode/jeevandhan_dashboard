"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  BarChart3,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Home,
  ClipboardList,
  UserCheck,
  Shield,
  Settings,
  Bell,
  Globe,
  User,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  MapPin,
  Phone,
  LogOut,
  ArrowUp,
  TrendingDown,
  X,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Activity,
  Target,
  RefreshCw,
  PieChart,
  Menu
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [activeView, setActiveView] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [_selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRiskBand, setFilterRiskBand] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Reports state
  const [reportDateRange, setReportDateRange] = useState({ from: "", to: "" });
  const [selectedReportType, setSelectedReportType] = useState("applications");
  const [reportFormat, setReportFormat] = useState("csv");

  // Fetch dashboard data - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const beneficiaryStats = useQuery(api.beneficiaries.getBeneficiaryStats, {});
  const digitalLendingAnalytics = useQuery(api.digitalLending.getDigitalLendingAnalytics, {});
  const applications = useQuery(api.digitalLending.getLendingApplications, { limit: 50 });
  const creditScores = useQuery(api.creditScoring.getCreditScores, { limit: 50 });
  
  // Mutations
  const reviewApplication = useMutation(api.digitalLending.reviewLendingApplication);
  const initializeData = useMutation(api.initializeData.initializeCompleteData);

  // Handler functions
  const handleInitializeData = useCallback(async () => {
    try {
      const result = await initializeData({ forceReset: true });
      console.log("Data initialized:", result);
    } catch (error) {
      console.error("Failed to initialize data:", error);
    }
  }, [initializeData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  // Auto-initialize data if no applications exist
  useEffect(() => {
    if (applications?.page && applications.page.length === 0) {
      handleInitializeData();
    }
  }, [applications, handleInitializeData]);

  // Filtering and sorting logic - MOVED TO TOP LEVEL
  const filteredAndSortedApplications = useMemo(() => {
    if (!applications?.page) return [];

    const filtered = applications.page.filter((app: { beneficiaryId: string; purpose: string; approvalStatus: string; createdAt: number; applicationId: string; requestedAmount: number }) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!app.beneficiaryId.toLowerCase().includes(searchLower) && 
            !app.purpose.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filterStatus !== "all" && app.approvalStatus !== filterStatus) {
        return false;
      }

      // Risk band filter
      if (filterRiskBand !== "all") {
        const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
        if (score?.riskBand !== filterRiskBand) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const appDate = new Date(app.createdAt);
        if (dateRange.from && appDate < new Date(dateRange.from)) return false;
        if (dateRange.to && appDate > new Date(dateRange.to)) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case "beneficiaryId":
          aValue = a.beneficiaryId;
          bValue = b.beneficiaryId;
          break;
        case "amount":
          aValue = a.requestedAmount || 0;
          bValue = b.requestedAmount || 0;
          break;
        case "score":
          const aScore = creditScores?.find(s => s.beneficiaryId === a.beneficiaryId);
          const bScore = creditScores?.find(s => s.beneficiaryId === b.beneficiaryId);
          aValue = aScore?.compositeScore || 0;
          bValue = bScore?.compositeScore || 0;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [applications, creditScores, searchTerm, filterStatus, filterRiskBand, sortField, sortDirection, dateRange]);

  // Show loading state while checking authentication - AFTER ALL HOOKS
  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated - AFTER ALL HOOKS
  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    { id: "overview", label: "Home / Overview", icon: Home },
    { id: "applications", label: "Applications", icon: ClipboardList },
    { id: "manual-review", label: "Manual Review Queue", icon: UserCheck },
    { id: "fraud-monitor", label: "Fraud Monitor", icon: Shield },
    { id: "model-management", label: "Model Management", icon: TrendingUp },
    { id: "shg-groups", label: "SHG / Groups", icon: Users },
    { id: "reports", label: "Reports & Exports", icon: FileText },
    { id: "settings", label: "Settings / Users", icon: Settings },
  ];

  const riskBands = [
    { name: "Low Risk-High Need", color: "bg-green-100 text-green-800 border-green-200" },
    { name: "Low Risk-Low Need", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { name: "High Risk-High Need", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { name: "High Risk-Low Need", color: "bg-red-100 text-red-800 border-red-200" }
  ];

  const getRiskBandColor = (riskBand: string) => {
    const band = riskBands.find(b => b.name === riskBand);
    return band ? band.color : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "auto_approved": return "bg-green-100 text-green-800 border-green-200";
      case "manual_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await reviewApplication({
        applicationId,
        decision: "approve",
        approvedAmount: 150000, // Default approved amount
        approvedTenure: 36, // Default tenure
        interestRate: 6.0, // Default interest rate
        conditions: ["Standard approval conditions"],
        reviewedBy: user?.name || "admin"
      });
      console.log("Application approved successfully");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to approve application:", err);
      alert(`Failed to approve application: ${err.message || 'Unknown error'}`);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await reviewApplication({
        applicationId,
        decision: "reject",
        rejectionReason: "Manual review rejection",
        reviewedBy: user?.name || "admin"
      });
      console.log("Application rejected successfully");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to reject application:", err);
      alert(`Failed to reject application: ${err.message || 'Unknown error'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedApplications.length === 0) return;

    try {
      for (const appId of selectedApplications) {
        if (action === "approve") {
          await reviewApplication({ 
            applicationId: appId, 
            decision: "approve",
            reviewedBy: user?.name || "System",
            approvedAmount: undefined,
            approvedTenure: undefined,
            interestRate: undefined,
            conditions: []
          });
        } else {
          await reviewApplication({ 
            applicationId: appId, 
            decision: "reject",
            reviewedBy: user?.name || "System",
            rejectionReason: "Bulk rejection"
          });
        }
      }
      setSelectedApplications([]);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Failed to ${action} applications:`, err);
      alert(`Failed to ${action} applications: ${err.message || 'Unknown error'}`);
    }
  };

  const toggleApplicationSelection = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const selectAllApplications = () => {
    if (selectedApplications.length === filteredAndSortedApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredAndSortedApplications.map(app => app.applicationId));
    }
  };

  // Render different views based on activeView
  const renderMainContent = () => {
    console.log("Rendering view:", activeView);
    switch (activeView) {
      case "overview":
        return renderOverviewContent();
      case "applications":
        return renderApplicationsContent();
      case "manual-review":
        return renderManualReviewContent();
      case "fraud-monitor":
        return renderFraudMonitorContent();
      case "model-management":
        return renderModelManagementContent();
      case "shg-groups":
        return renderSHGGroupsContent();
      case "reports":
        return renderReportsContent();
      case "settings":
        return renderSettingsContent();
      default:
        console.log("Using default view for:", activeView);
        return renderApplicationsContent();
    }
  };

  const renderOverviewContent = () => {
    const totalAmount = applications?.page?.reduce((sum, app) => sum + (app.requestedAmount || 0), 0) || 0;
    const approvedAmount = applications?.page?.filter(app => app.approvalStatus === 'auto_approved').reduce((sum, app) => sum + (app.requestedAmount || 0), 0) || 0;
    const approvalRate = applications?.page?.length ? Math.round((applications.page.filter(app => app.approvalStatus === 'auto_approved').length / applications.page.length) * 100) : 0;
    const avgScore = creditScores?.length ? Math.round(creditScores.reduce((sum, score) => sum + score.compositeScore, 0) / creditScores.length) : 0;

  return (
      <div className="flex-1 p-3 sm:p-6">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xs sm:text-sm font-medium">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Total Beneficiaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {beneficiaryStats?.total || 0}
        </div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12% from last month</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xs sm:text-sm font-medium">
                <ClipboardList className="h-4 w-4 mr-2 text-green-600" />
                Applications Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {applications?.page?.length || 0}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Approval Rate: {approvalRate}%</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xs sm:text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                Loan Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                ₹{(totalAmount / 100000).toFixed(1)}L
              </div>
              <div className="flex items-center mt-1">
                <Activity className="h-3 w-3 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">Approved: ₹{(approvedAmount / 100000).toFixed(1)}L</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xs sm:text-sm font-medium">
                <Target className="h-4 w-4 mr-2 text-orange-600" />
                Avg Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {avgScore}
              </div>
              <div className="flex items-center mt-1">
                <BarChart3 className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600">Model Performance: 94.2%</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-bl-full opacity-20"></div>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Low Risk-High Need", count: applications?.page?.filter(app => {
                    const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                    return score?.riskBand === 'Low Risk-High Need';
                  }).length || 0, color: "bg-green-500", textColor: "text-green-700" },
                  { name: "Low Risk-Low Need", count: applications?.page?.filter(app => {
                    const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                    return score?.riskBand === 'Low Risk-Low Need';
                  }).length || 0, color: "bg-blue-500", textColor: "text-blue-700" },
                  { name: "High Risk-High Need", count: applications?.page?.filter(app => {
                    const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                    return score?.riskBand === 'High Risk-High Need';
                  }).length || 0, color: "bg-yellow-500", textColor: "text-yellow-700" },
                  { name: "High Risk-Low Need", count: applications?.page?.filter(app => {
                    const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                    return score?.riskBand === 'High Risk-Low Need';
                  }).length || 0, color: "bg-red-500", textColor: "text-red-700" }
                ].map((band) => {
                  const percentage = applications?.page?.length ? Math.round((band.count / applications.page.length) * 100) : 0;
                  return (
                    <div key={band.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${band.color} mr-3`}></div>
                        <span className="text-sm text-gray-700">{band.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{band.count}</span>
                        <span className={`text-xs ${band.textColor}`}>({percentage}%)</span>
      </div>
    </div>
  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "auto_approved", label: "Auto Approved", color: "bg-green-500", icon: CheckCircle },
                  { status: "manual_review", label: "Manual Review", color: "bg-yellow-500", icon: Clock },
                  { status: "rejected", label: "Rejected", color: "bg-red-500", icon: X },
                  { status: "pending", label: "Pending", color: "bg-gray-500", icon: Clock }
                ].map((item) => {
                  const count = applications?.page?.filter(app => app.approvalStatus === item.status).length || 0;
                  const percentage = applications?.page?.length ? Math.round((count / applications.page.length) * 100) : 0;
                  const Icon = item.icon;
                  return (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3 text-gray-600" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity with Enhanced Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-gray-600" />
                Recent Activity
              </span>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications?.page?.slice(0, 8).map((app) => {
                const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                return (
                  <div key={app.applicationId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.beneficiaryId}</p>
                        <p className="text-sm text-gray-600">₹{app.requestedAmount?.toLocaleString()} • {app.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {score && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Score: {score.compositeScore}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${getRiskBandColor(score.riskBand)}`}>
                            {score.riskBand}
                          </div>
                        </div>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.approvalStatus)}`}>
                        {app.approvalStatus?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              }) || <p className="text-gray-500 text-center py-8">No recent applications</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderApplicationsContent = () => (
    <div className="flex-1 p-3 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Enhanced Header with Search and Filters */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Applications ({filteredAndSortedApplications.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {selectedApplications.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">{selectedApplications.length} selected</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkAction("approve")}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction("reject")}
                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Filters
                {showFilters ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />}
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm hidden sm:flex">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Export
              </Button>
              {(!applications?.page || applications.page.length === 0) && (
                <Button 
                  size="sm" 
                  onClick={handleInitializeData}
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Init Data
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Search by ID or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterRiskBand("all");
                setDateRange({ from: "", to: "" });
              }}
            >
              Clear All
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="auto_approved">Auto Approved</option>
                  <option value="manual_review">Manual Review</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Band</label>
                <select 
                  value={filterRiskBand}
                  onChange={(e) => setFilterRiskBand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Risk Bands</option>
                  <option value="Low Risk-High Need">Low Risk-High Need</option>
                  <option value="Low Risk-Low Need">Low Risk-Low Need</option>
                  <option value="High Risk-High Need">High Risk-High Need</option>
                  <option value="High Risk-Low Need">High Risk-Low Need</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={selectedApplications.length === filteredAndSortedApplications.length && filteredAndSortedApplications.length > 0}
                    onChange={selectAllApplications}
                  />
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort("beneficiaryId")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Beneficiary</span>
                    {sortField === "beneficiaryId" && (
                      sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </button>
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort("score")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Score</span>
                    {sortField === "score" && (
                      sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </button>
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Band
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort("amount")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Amount</span>
                    {sortField === "amount" && (
                      sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedApplications.length > 0 ? (
                filteredAndSortedApplications.map((application: { applicationId: string; beneficiaryId: string; requestedAmount: number; purpose: string; approvalStatus: string; createdAt: number; processingTime?: number }) => {
                  const score = creditScores?.find(s => s.beneficiaryId === application.beneficiaryId);
                  const isSelected = selectedApplications.includes(application.applicationId);
                  return (
                    <tr 
                      key={application.applicationId} 
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={isSelected}
                          onChange={() => toggleApplicationSelection(application.applicationId)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {application.beneficiaryId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.purpose}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {score ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${getScoreColor(score.compositeScore)}`}
                                style={{ width: `${score.compositeScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{score.compositeScore}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No score</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {score ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskBandColor(score.riskBand)}`}>
                            {score.riskBand}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{application.requestedAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.approvalStatus)}`}>
                          {application.approvalStatus?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplication(application.beneficiaryId)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {application.approvalStatus === 'manual_review' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveApplication(application.applicationId)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectApplication(application.applicationId)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : applications === undefined ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Clock className="h-8 w-8 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-500">Loading applications...</div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-500 mb-2">
                        {searchTerm || filterStatus !== "all" || filterRiskBand !== "all" || dateRange.from || dateRange.to
                          ? "No applications match your filters"
                          : "No applications found"
                        }
                      </div>
                      {(searchTerm || filterStatus !== "all" || filterRiskBand !== "all" || dateRange.from || dateRange.to) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                            setFilterRiskBand("all");
                            setDateRange({ from: "", to: "" });
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderManualReviewContent = () => (
    <div className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-yellow-600" />
            Manual Review Queue
          </CardTitle>
          <CardDescription>
            Applications requiring manual review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications?.page?.filter(app => app.approvalStatus === 'manual_review').map((app) => (
              <div key={app.applicationId} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.beneficiaryId}</h3>
                    <p className="text-sm text-gray-600">₹{app.requestedAmount?.toLocaleString()} for {app.purpose}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveApplication(app.applicationId)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectApplication(app.applicationId)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )) || <p className="text-gray-500">No applications in manual review queue</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFraudMonitorContent = () => {
    const highRiskApps = applications?.page?.filter(app => {
      const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
      return score?.riskBand?.includes('High Risk');
    }) || [];

    const suspiciousPatterns = [
      { id: 1, type: "Multiple Applications", description: "Same phone number used in 3+ applications", severity: "high", count: 2 },
      { id: 2, type: "Rapid Submissions", description: "5 applications submitted within 1 hour", severity: "medium", count: 5 },
      { id: 3, type: "Duplicate Documents", description: "Same Aadhaar document used multiple times", severity: "high", count: 1 },
      { id: 4, type: "Unusual Amounts", description: "Applications for exactly ₹1,50,000", severity: "low", count: 8 }
    ];

    return (
      <div className="flex-1 p-6">
        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-red-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-red-600">+2 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-yellow-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                High Risk Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{highRiskApps.length}</div>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-5% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-orange-800">
                <Eye className="h-4 w-4 mr-2" />
                Under Investigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">7</div>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600">Avg: 2.3 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-blue-800">
                <Shield className="h-4 w-4 mr-2" />
                Blocked Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="flex items-center mt-1">
                <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">Auto-blocked: 9</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-red-600" />
                  Real-time Alerts
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-900">Critical: Document Fraud</span>
                        <span className="text-xs text-gray-500">2 min ago</span>
                      </div>
                      <p className="text-sm text-red-700">NBCFDC007 submitted altered Aadhaar document</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Block Application
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-900">High Risk Score</span>
                        <span className="text-xs text-gray-500">5 min ago</span>
                      </div>
                      <p className="text-sm text-yellow-700">NBCFDC012 scored 25/100 - multiple risk factors</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                          Manual Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Info className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-900">Suspicious Pattern</span>
                        <span className="text-xs text-gray-500">12 min ago</span>
                      </div>
                      <p className="text-sm text-orange-700">Same device used for 4 applications in 30 minutes</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                          Flag Device
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          Related Apps
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suspicious Patterns Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          pattern.severity === 'high' ? 'bg-red-500' :
                          pattern.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{pattern.type}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pattern.severity === 'high' ? 'bg-red-100 text-red-800' :
                        pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pattern.count} cases
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Search className="h-3 w-3 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Rule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investigation Tools */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-gray-600" />
              Investigation Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Phone className="h-6 w-6 mb-2" />
                Phone Number Lookup
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <User className="h-6 w-6 mb-2" />
                Identity Verification
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                Address Validation
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Document Analysis
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Activity className="h-6 w-6 mb-2" />
                Behavior Analysis
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Shield className="h-6 w-6 mb-2" />
                Risk Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderModelManagementContent = () => {
    const totalPredictions = applications?.page?.length || 0;
    const autoApproved = applications?.page?.filter(app => app.approvalStatus === 'auto_approved').length || 0;
    
    const autoApprovalRate = totalPredictions ? Math.round((autoApproved / totalPredictions) * 100) : 0;
    const avgScore = creditScores?.length ? Math.round(creditScores.reduce((sum, score) => sum + score.compositeScore, 0) / creditScores.length) : 0;

    const modelVersions = [
      { version: "v2.1", status: "active", accuracy: 94.2, deployed: "2024-01-15", description: "Enhanced risk assessment with consumption data" },
      { version: "v2.0", status: "deprecated", accuracy: 91.8, deployed: "2023-12-10", description: "Improved income verification model" },
      { version: "v1.5", status: "archived", accuracy: 89.3, deployed: "2023-11-05", description: "Initial production model" },
    ];

    const performanceMetrics = [
      { metric: "Precision", value: 92.4, trend: "+2.1%", color: "text-green-600" },
      { metric: "Recall", value: 88.7, trend: "+1.8%", color: "text-green-600" },
      { metric: "F1-Score", value: 90.5, trend: "+1.9%", color: "text-green-600" },
      { metric: "AUC-ROC", value: 95.1, trend: "+0.8%", color: "text-green-600" },
    ];

    return (
      <div className="flex-1 p-6">
        {/* Model Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-blue-800">
                <TrendingUp className="h-4 w-4 mr-2" />
                Model Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">94.2%</div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+2.1% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                Auto-Approval Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{autoApprovalRate}%</div>
              <div className="flex items-center mt-1">
                <Activity className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">{autoApproved}/{totalPredictions} today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-purple-800">
                <Target className="h-4 w-4 mr-2" />
                Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{avgScore}</div>
              <div className="flex items-center mt-1">
                <BarChart3 className="h-3 w-3 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">Score distribution</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-orange-800">
                <Clock className="h-4 w-4 mr-2" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1.8s</div>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-0.5s improved</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Versions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  Model Versions
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelVersions.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{model.version}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          model.status === 'active' ? 'bg-green-100 text-green-800' :
                          model.status === 'deprecated' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {model.status}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{model.accuracy}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Deployed: {model.deployed}</span>
                      <div className="flex items-center space-x-2">
                        {model.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline">Monitor</Button>
                            <Button size="sm" variant="outline">Rollback</Button>
                          </>
                        )}
                        {model.status !== 'active' && (
                          <Button size="sm" variant="outline">Restore</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{metric.metric}</div>
                      <div className="text-sm text-gray-600">Model performance indicator</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{metric.value}%</div>
                      <div className={`text-sm ${metric.color}`}>{metric.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Model Health Score</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-blue-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-900">92/100</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Excellent performance across all metrics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Training & Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <RefreshCw className="h-4 w-4 mr-2 text-green-600" />
                Training Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Auto-Retrain</span>
                  <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-green-700">Scheduled: Weekly on Sundays</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Training Data:</span>
                  <span className="font-medium">15,847 samples</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Training:</span>
                  <span className="font-medium">3 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Training:</span>
                  <span className="font-medium">4 days</span>
                </div>
              </div>
              
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Trigger Retrain
              </Button>
            </CardContent>
          </Card>

          {/* Model Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Activity className="h-4 w-4 mr-2 text-blue-600" />
                Real-time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predictions/hour:</span>
                  <span className="text-sm font-medium">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Error Rate:</span>
                  <span className="text-sm font-medium text-green-600">0.02%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drift Detection:</span>
                  <span className="text-sm font-medium text-green-600">Normal</span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-900">Live Monitoring</span>
                </div>
                <p className="text-xs text-blue-700">All systems operational</p>
              </div>
              
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Model Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Settings className="h-4 w-4 mr-2 text-purple-600" />
                Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Model
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                A/B Test Setup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-2" />
                Alert Configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Feature Importance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Bias Detection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderSHGGroupsContent = () => (
    <div className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Self Help Groups (SHGs)
          </CardTitle>
          <CardDescription>
            Manage Self Help Groups and their members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="font-medium text-purple-900">Total SHGs</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Total Members</p>
                  <p className="text-2xl font-bold text-blue-600">{beneficiaryStats?.total || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="font-medium text-green-900">Active Groups</p>
                  <p className="text-2xl font-bold text-green-600">10</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Recent SHG Activity</h3>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Mahila Vikas SHG</h4>
                    <p className="text-sm text-gray-600">Rajasthan • 15 members • Active</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Swayam Sahayata Group</h4>
                    <p className="text-sm text-gray-600">Madhya Pradesh • 12 members • Active</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsContent = () => {
    const reportTypes = [
      { id: "applications", name: "Loan Applications Report", description: "Detailed report of all loan applications with scores and status" },
      { id: "credit_analytics", name: "Credit Score Analytics", description: "Analysis of credit scoring patterns and model performance" },
      { id: "beneficiary_summary", name: "Beneficiary Summary", description: "Summary of all registered beneficiaries and their profiles" },
      { id: "fraud_report", name: "Fraud Detection Report", description: "Security incidents and suspicious activity analysis" },
      { id: "performance_metrics", name: "Performance Metrics", description: "System performance and operational statistics" },
      { id: "compliance_report", name: "Compliance Report", description: "Regulatory compliance and audit trail report" }
    ];

    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select 
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      placeholder="From date"
                      value={reportDateRange.from}
                      onChange={(e) => setReportDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="text-sm"
                    />
                    <Input
                      type="date"
                      placeholder="To date"
                      value={reportDateRange.to}
                      onChange={(e) => setReportDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select 
                    value={reportFormat}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Today&apos;s Applications
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  High Risk Cases
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Reviews
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Weekly Summary
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview and Statistics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    {reportTypes.find(t => t.id === selectedReportType)?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Ready</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  {reportTypes.find(t => t.id === selectedReportType)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Report Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Records</div>
                    <div className="text-xl font-bold text-blue-900">
                      {selectedReportType === 'applications' ? applications?.page?.length || 0 :
                       selectedReportType === 'beneficiary_summary' ? beneficiaryStats?.total || 0 :
                       selectedReportType === 'credit_analytics' ? creditScores?.length || 0 : 156}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Processed</div>
                    <div className="text-xl font-bold text-green-900">
                      {selectedReportType === 'applications' ? 
                        applications?.page?.filter((app: { approvalStatus: string }) => app.approvalStatus !== 'pending').length || 0 : 142}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Pending</div>
                    <div className="text-xl font-bold text-yellow-900">
                      {selectedReportType === 'applications' ? 
                        applications?.page?.filter((app: { approvalStatus: string }) => app.approvalStatus === 'manual_review').length || 0 : 14}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">File Size</div>
                    <div className="text-xl font-bold text-purple-900">2.3 MB</div>
                  </div>
                </div>

                {/* Sample Data Preview */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h4 className="text-sm font-medium text-gray-900">Data Preview</h4>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {selectedReportType === 'applications' ? (
                              <>
                                <th className="text-left py-2">Application ID</th>
                                <th className="text-left py-2">Beneficiary</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Status</th>
                                <th className="text-left py-2">Score</th>
                              </>
                            ) : (
                              <>
                                <th className="text-left py-2">ID</th>
                                <th className="text-left py-2">Name</th>
                                <th className="text-left py-2">Value</th>
                                <th className="text-left py-2">Status</th>
                                <th className="text-left py-2">Date</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {applications?.page?.slice(0, 5).map((app: { applicationId: string; beneficiaryId: string; requestedAmount: number; approvalStatus: string }, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{app.applicationId}</td>
                              <td className="py-2">{app.beneficiaryId}</td>
                              <td className="py-2">₹{app.requestedAmount?.toLocaleString()}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.approvalStatus)}`}>
                                  {app.approvalStatus?.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-2">
                                {creditScores?.find(s => s.beneficiaryId === app.beneficiaryId)?.compositeScore || 'N/A'}
                              </td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-500">
                                No data available for preview
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Daily Applications Report", date: "2024-01-15", size: "1.2 MB", format: "CSV", status: "completed" },
                    { name: "Credit Score Analytics", date: "2024-01-14", size: "3.4 MB", format: "PDF", status: "completed" },
                    { name: "Fraud Detection Summary", date: "2024-01-14", size: "856 KB", format: "Excel", status: "completed" },
                    { name: "Weekly Performance Report", date: "2024-01-13", size: "2.1 MB", format: "PDF", status: "processing" }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-xs text-gray-500">{report.date} • {report.size} • {report.format}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                        {report.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsContent = () => (
    <div className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            Settings & User Management
          </CardTitle>
          <CardDescription>
            Configure system settings and manage users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Auto-Approval Settings</h4>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Enable Auto-Approval:</span>
                    <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score Threshold:</span>
                    <span className="text-sm font-medium">70</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Max Amount:</span>
                    <span className="text-sm font-medium">₹1,50,000</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Model Configuration</h4>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Model:</span>
                    <span className="text-sm font-medium">v1.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Retrain Frequency:</span>
                    <span className="text-sm font-medium">Weekly</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Current User</h4>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <User className="h-8 w-8 bg-gray-200 rounded-full p-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.roleName}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full">Change Password</Button>
                <Button variant="outline" className="w-full">Update Profile</Button>
                <Button variant="outline" className="w-full">Manage Permissions</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu + Logo + Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 hidden sm:block">NBCFDC Credit Dashboard</h1>
              <h1 className="text-sm font-bold text-gray-900 sm:hidden">NBCFDC</h1>
            </div>
          </div>

          {/* Center: Global Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right: User Info + Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                v1.0
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-8 w-8 bg-gray-200 rounded-full p-1" />
                <div className="text-sm">
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-gray-500 text-xs">{user?.roleName || 'Role'}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 flex-col">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log("Switching to view:", item.id);
                    setActiveView(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-xl">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <nav className="px-4 py-6 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        console.log("Switching to view:", item.id);
                        setActiveView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeView === item.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-x-hidden">
          {/* KPI Strip */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {digitalLendingAnalytics?.totalApplications || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Applications (30d)</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {digitalLendingAnalytics?.autoApprovalRate || 0}%
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Auto-Approve</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  {digitalLendingAnalytics?.averageProcessingTime || 0}s
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">85%</div>
                <div className="text-xs sm:text-sm text-gray-500">w/ Data</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">2.1%</div>
                <div className="text-sm text-gray-500">Default Rate (30d)</div>
              </div>
            </div>
          </div>

          <div className="flex flex-1">
            {/* Dynamic Main Content */}
            {renderMainContent()}

            {/* Right Column - Context Widgets */}
            <div className="w-80 bg-gray-50 p-6 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Risk Band Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full border bg-green-100 text-green-800 border-green-200">
                        Low Risk-High Need
                      </span>
                      <span className="text-sm font-medium">
                        {applications?.page?.filter(app => {
                          const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                          return score?.riskBand === 'Low Risk-High Need';
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                        Low Risk-Low Need
                      </span>
                      <span className="text-sm font-medium">
                        {applications?.page?.filter(app => {
                          const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                          return score?.riskBand === 'Low Risk-Low Need';
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                        High Risk-High Need
                      </span>
                      <span className="text-sm font-medium">
                        {applications?.page?.filter(app => {
                          const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                          return score?.riskBand === 'High Risk-High Need';
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full border bg-red-100 text-red-800 border-red-200">
                        High Risk-Low Need
                      </span>
                      <span className="text-sm font-medium">
                        {applications?.page?.filter(app => {
                          const score = creditScores?.find(s => s.beneficiaryId === app.beneficiaryId);
                          return score?.riskBand === 'High Risk-Low Need';
                        }).length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Manual Review Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {applications?.page?.filter(app => app.approvalStatus === 'manual_review').length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Pending Reviews</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs text-gray-700">Model drift detected</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-gray-700">Fraud flag: NBCFDC003</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto-Approve</span>
                    <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Score Threshold</span>
                    <span className="text-sm font-medium">70</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Policy Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
