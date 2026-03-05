'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate fake API network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                            <Mail size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-zinc-100 mb-2">Reset Password</h1>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex flex-col items-center gap-2 mb-6 text-sm">
                                <CheckCircle2 size={24} />
                                <p>Check your email! We sent a recovery link to <strong>{email}</strong>.</p>
                            </div>
                            <Link href="/login">
                                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                    Return to Login
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <p className="text-zinc-400 text-sm text-center mb-8">
                                Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-500 font-medium">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="hero@efit.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                    {status !== 'loading' && <ArrowRight size={16} className="ml-2" />}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-xs text-zinc-500 hover:text-orange-400 transition-colors"
                                >
                                    <ArrowLeft size={12} className="mr-1" /> Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
