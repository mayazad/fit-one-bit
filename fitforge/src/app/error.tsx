'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Here we could log the error to an error reporting service like Sentry
        console.error('FitForge caught a global error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-zinc-50">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2">System Glitch Detected</h1>
                <p className="text-zinc-400 text-sm mb-6">
                    Apologies, but the matrix just hiccuped. An unexpected error occurred while processing this request.
                </p>

                <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-4 mb-8 text-left overflow-hidden">
                    <p className="font-mono text-[10px] text-red-400/80 break-words">
                        {error.message || 'Unknown error trace.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => reset()}
                        variant="outline"
                        className="h-12 w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
                    </Button>

                    <Button
                        asChild
                        className="h-12 w-full bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                    >
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
