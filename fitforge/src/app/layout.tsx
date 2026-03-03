import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eFit | Digital Health",
  description: "Your AI-powered body transformation companion. Track workouts, plan meals, monitor progress, and level up with gamification.",
  keywords: ["fitness", "body transformation", "workout tracker", "meal planner", "AI coach"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f4f7f6] dark:bg-[#0f172a] text-slate-800 dark:text-foreground`}
      >
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <AppShell>
              <ProtectedRoute>{children}</ProtectedRoute>
            </AppShell>
            <footer className="w-full pt-6 pb-24 md:pb-6 mt-auto text-center text-xs font-medium text-emerald-600/60 dark:text-slate-500 tracking-wide border-t border-emerald-100/50 dark:border-zinc-800/50 bg-[#f4f7f6]/80 dark:bg-[#0f172a]/80 relative z-50 backdrop-blur-sm">
              &copy; {new Date().getFullYear()} MayazAD. All rights reserved.
            </footer>
          </div>
          <Toaster theme="dark" position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
