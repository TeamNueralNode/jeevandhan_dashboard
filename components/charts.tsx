"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color schemes
const COLORS = {
  primary: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
  success: ["#16a34a", "#22c55e", "#4ade80", "#86efac"],
  warning: ["#d97706", "#f59e0b", "#fbbf24", "#fcd34d"],
  danger: ["#dc2626", "#ef4444", "#f87171", "#fca5a5"],
  purple: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd"],
};

interface ScoreTrendData {
  month: string;
  avgScore: number;
  applications: number;
}

interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Add index signature for recharts compatibility
}

interface ProcessingTimeData {
  category: string;
  autoApproved: number;
  manualReview: number;
}

export function ScoreTrendChart({ data }: { data: ScoreTrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="avgScore"
          stroke="#2563eb"
          fillOpacity={1}
          fill="url(#colorScore)"
          name="Average Score"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RiskDistributionChart({ data }: { data: RiskDistributionData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => {
            const percent = entry.percent as number || 0;
            return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
          }}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProcessingTimeChart({ data }: { data: ProcessingTimeData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="category" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="autoApproved" fill="#16a34a" name="Auto-Approved" radius={[8, 8, 0, 0]} />
        <Bar dataKey="manualReview" fill="#f59e0b" name="Manual Review" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MonthlyApplicationData {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

export function MonthlyApplicationChart({ data }: { data: MonthlyApplicationData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="approved"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Approved"
        />
        <Line
          type="monotone"
          dataKey="rejected"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Rejected"
        />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Pending"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface IncomeVerificationData {
  category: string;
  verified: number;
  pending: number;
}

export function IncomeVerificationChart({ data }: { data: IncomeVerificationData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" />
        <YAxis dataKey="category" type="category" stroke="#6b7280" width={100} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="verified" stackId="a" fill="#7c3aed" name="Verified" />
        <Bar dataKey="pending" stackId="a" fill="#c4b5fd" name="Pending" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ComparisonData {
  label: string;
  before: number;
  after: number;
}

export function ComparisonChart({ data }: { data: ComparisonData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="before" fill="#94a3b8" name="Before AI" radius={[8, 8, 0, 0]} />
        <Bar dataKey="after" fill="#2563eb" name="After AI" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
