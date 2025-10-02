"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Zap,
  Phone,
  Droplet,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Trash2,
  DollarSign,
} from "lucide-react";

interface MobileRecharge {
  amount: number;
  date: number;
}

interface UtilityBill {
  type: string;
  amount: number;
  date: number;
}

export default function ConsumptionUploadPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const uploadConsumptionData = useMutation(api.consumptionUpload.uploadConsumptionData);
  
  // Form state
  const [selectedType, setSelectedType] = useState<string>("");
  const [monthYear, setMonthYear] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [beneficiaryId, setBeneficiaryId] = useState<string>("");
  
  // Electricity data
  const [electricityUnits, setElectricityUnits] = useState<string>("");
  const [electricityBill, setElectricityBill] = useState<string>("");
  
  // Mobile recharge data
  const [mobileRecharges, setMobileRecharges] = useState<MobileRecharge[]>([]);
  const [rechargeAmount, setRechargeAmount] = useState<string>("");
  const [rechargeDate, setRechargeDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  
  // Utility bills data
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([]);
  const [utilityType, setUtilityType] = useState<string>("water");
  const [utilityAmount, setUtilityAmount] = useState<string>("");
  const [utilityDate, setUtilityDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  // Get existing consumption data
  const consumptionData = useQuery(
    api.consumptionUpload.getConsumptionData,
    beneficiaryId ? { beneficiaryId } : "skip"
  );

  const handleAddRecharge = () => {
    if (rechargeAmount && rechargeDate) {
      setMobileRecharges([
        ...mobileRecharges,
        {
          amount: parseFloat(rechargeAmount),
          date: new Date(rechargeDate).getTime(),
        },
      ]);
      setRechargeAmount("");
      setRechargeDate(new Date().toISOString().slice(0, 10));
      toast.success("Recharge added");
    } else {
      toast.error("Please fill all recharge fields");
    }
  };

  const handleRemoveRecharge = (index: number) => {
    setMobileRecharges(mobileRecharges.filter((_, i) => i !== index));
  };

  const handleAddUtilityBill = () => {
    if (utilityType && utilityAmount && utilityDate) {
      setUtilityBills([
        ...utilityBills,
        {
          type: utilityType,
          amount: parseFloat(utilityAmount),
          date: new Date(utilityDate).getTime(),
        },
      ]);
      setUtilityAmount("");
      setUtilityDate(new Date().toISOString().slice(0, 10));
      toast.success("Utility bill added");
    } else {
      toast.error("Please fill all utility bill fields");
    }
  };

  const handleRemoveUtilityBill = (index: number) => {
    setUtilityBills(utilityBills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploadSuccess(false);

    if (!beneficiaryId || !selectedType) {
      setError("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      const uploadData: {
        beneficiaryId: string;
        dataType: string;
        monthYear: string;
        uploadedBy: string;
        electricityUnits?: number;
        electricityBill?: number;
        mobileRecharges?: MobileRecharge[];
        utilityBills?: UtilityBill[];
      } = {
        beneficiaryId,
        dataType: selectedType,
        monthYear,
        uploadedBy: user?.roleId || "beneficiary",
      };

      if (selectedType === "electricity") {
        if (electricityUnits) uploadData.electricityUnits = parseFloat(electricityUnits);
        if (electricityBill) uploadData.electricityBill = parseFloat(electricityBill);
      } else if (selectedType === "mobile") {
        uploadData.mobileRecharges = mobileRecharges;
      } else if (selectedType === "utility") {
        uploadData.utilityBills = utilityBills;
      }

      await uploadConsumptionData(uploadData);
      
      toast.success("Data uploaded successfully!", {
        description: "Your submission is pending verification."
      });
      
      // Reset form
      setElectricityUnits("");
      setElectricityBill("");
      setMobileRecharges([]);
      setUtilityBills([]);
      setSelectedType("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload data";
      toast.error("Upload failed", {
        description: errorMsg
      });
      setError(errorMsg);
    } finally {
      setUploading(false);
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

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Upload Consumption Data</h1>
                <p className="text-sm text-gray-600">Submit your utility bills and consumption proofs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Logged in as:</span>
              <span className="font-semibold text-blue-600">{user?.roleId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">Data uploaded successfully! Your submission is pending verification.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Submit Consumption Details</span>
                </CardTitle>
                <CardDescription>
                  Upload your utility bills and consumption data to enhance your credit profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Beneficiary ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary ID *
                    </label>
                    <Input
                      type="text"
                      value={beneficiaryId}
                      onChange={(e) => setBeneficiaryId(e.target.value)}
                      placeholder="e.g., BEN-001"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Month/Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month & Year *
                    </label>
                    <Input
                      type="month"
                      value={monthYear}
                      onChange={(e) => setMonthYear(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Data Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Data Type *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedType("electricity")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedType === "electricity"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Zap className={`h-8 w-8 mx-auto mb-2 ${
                          selectedType === "electricity" ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <p className="text-sm font-medium">Electricity Bill</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedType("mobile")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedType === "mobile"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Phone className={`h-8 w-8 mx-auto mb-2 ${
                          selectedType === "mobile" ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <p className="text-sm font-medium">Mobile Recharge</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedType("utility")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedType === "utility"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Droplet className={`h-8 w-8 mx-auto mb-2 ${
                          selectedType === "utility" ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <p className="text-sm font-medium">Utility Bills</p>
                      </button>
                    </div>
                  </div>

                  {/* Conditional Fields Based on Type */}
                  {selectedType === "electricity" && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Electricity Bill Details</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Units Consumed (kWh)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={electricityUnits}
                            onChange={(e) => setElectricityUnits(e.target.value)}
                            placeholder="e.g., 250"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bill Amount (₹)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={electricityBill}
                            onChange={(e) => setElectricityBill(e.target.value)}
                            placeholder="e.g., 1500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedType === "mobile" && (
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-medium text-purple-900 flex items-center space-x-2">
                        <Phone className="h-5 w-5" />
                        <span>Mobile Recharge Details</span>
                      </h3>
                      
                      {/* Add Recharge Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recharge Amount (₹)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            placeholder="e.g., 299"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recharge Date
                          </label>
                          <Input
                            type="date"
                            value={rechargeDate}
                            onChange={(e) => setRechargeDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddRecharge}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Add Recharge
                      </Button>

                      {/* Recharge List */}
                      {mobileRecharges.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Added Recharges:</p>
                          {mobileRecharges.map((recharge, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded border"
                            >
                              <div className="flex items-center space-x-4">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold">₹{recharge.amount}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(recharge.date).toLocaleDateString()}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveRecharge(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedType === "utility" && (
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 flex items-center space-x-2">
                        <Droplet className="h-5 w-5" />
                        <span>Utility Bill Details</span>
                      </h3>
                      
                      {/* Add Utility Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Utility Type
                          </label>
                          <select
                            value={utilityType}
                            onChange={(e) => setUtilityType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="water">Water</option>
                            <option value="gas">Gas/LPG</option>
                            <option value="internet">Internet</option>
                            <option value="cable">Cable/DTH</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bill Amount (₹)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={utilityAmount}
                            onChange={(e) => setUtilityAmount(e.target.value)}
                            placeholder="e.g., 500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bill Date
                          </label>
                          <Input
                            type="date"
                            value={utilityDate}
                            onChange={(e) => setUtilityDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddUtilityBill}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Add Utility Bill
                      </Button>

                      {/* Utility List */}
                      {utilityBills.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Added Utility Bills:</p>
                          {utilityBills.map((bill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded border"
                            >
                              <div className="flex items-center space-x-4">
                                <Droplet className="h-4 w-4 text-gray-400" />
                                <span className="font-medium capitalize">{bill.type}</span>
                                <span className="font-semibold">₹{bill.amount}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(bill.date).toLocaleDateString()}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveUtilityBill(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploading || !selectedType}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Data
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Why Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Upload?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Improve your credit score with verified consumption data</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Get better loan terms and faster approval</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Build a comprehensive financial profile</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            {consumptionData && consumptionData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Uploads</CardTitle>
                  <CardDescription>Your submitted consumption data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {consumptionData.slice(0, 5).map((data: { dataId: string; dataType: string; monthYear: string; verificationStatus: string }) => (
                    <div
                      key={data.dataId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium capitalize">{data.dataType}</p>
                          <p className="text-xs text-gray-500">{data.monthYear}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          data.verificationStatus === "verified"
                            ? "bg-green-100 text-green-800"
                            : data.verificationStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {data.verificationStatus}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
