"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/lib/auth/auth-context";
import { useMemo } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazily create the Convex client only when we have a URL (avoids build-time crashes)
  const convex = useMemo(() => {
    if (!CONVEX_URL) return null;
    return new ConvexReactClient(CONVEX_URL, {
      skipConvexDeploymentUrlCheck: true,
    });
  }, []);

  if (!CONVEX_URL || !convex) {
    // Friendly runtime message instead of throwing at build time
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full rounded-md border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Configuration required</h2>
          <p className="text-sm text-gray-600">
            Environment variable <code>NEXT_PUBLIC_CONVEX_URL</code> is not set. Set it to your Convex deployment URL and restart the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>{children}</AuthProvider>
    </ConvexProvider>
  );
}