"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(CONVEX_URL, {
  skipConvexDeploymentUrlCheck: true
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConvexProvider>
  );
}