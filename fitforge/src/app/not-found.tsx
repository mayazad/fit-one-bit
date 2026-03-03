'use client';

import Link from "next/link";
import { ArrowLeft, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-lg">
                {/* Glitchy Text Effect simulation */}
                <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.4)] mix-blend-screen">
                    404
                </h1>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Zap className="text-orange-400 animate-pulse" size={24} />
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">Connection Lost</h2>
                    <Zap className="text-orange-400 animate-pulse" size={24} />
                </div>

                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                    It looks like you ventured too far off the grid. The page you are looking for has been lifted, deleted, or never existed in this dimension.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild variant="outline" className="h-12 px-6 w-full sm:w-auto border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                        <button onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </button>
                    </Button>

                    <Button asChild className="h-12 px-8 w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" /> Return to Base
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
