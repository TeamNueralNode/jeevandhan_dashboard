"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome, Admin!</p>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
  );
}