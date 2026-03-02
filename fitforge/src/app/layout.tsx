import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { TooltipProvider } from "@/components/ui/tooltip";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <AppShell>{children}</AppShell>
            <footer className="w-full py-6 mt-auto text-center text-sm text-zinc-500 border-t border-zinc-800/50 bg-zinc-950 relative z-50">
              &copy; {new Date().getFullYear()} MayazAD. All rights reserved.
            </footer>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
