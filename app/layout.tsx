import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "./components/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  // Specify the weights you're actually using
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NBCFDC Credit Scoring Dashboard",
  description: "Beneficiary Credit Scoring with Income Verification Layer for Direct Digital Lending",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
          <ToastProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
