'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, Apple,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { useGamificationStore } from '@/stores/gamificationStore';

const fadeSlide = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setUserProfile = useUserStore(state => state.setUserProfile);
    const hydrateGamification = useGamificationStore(state => state.hydrateGamification);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                const res = await fetch('http://localhost:3001/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        password: form.password,
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to sign up');
                }

                const user = await res.json();

                // Hydrate Zustand stores with the real DB data
                setUserProfile({
                    name: user.name || '',
                    age: user.profile?.baseStats?.age || 0,
                    height: user.profile?.baseStats?.height || '',
                    weight: user.profile?.baseStats?.weight || 0,
                    goals: user.profile?.focusAreas || [],
                    avatar: 'beginner',
                    createdAt: user.createdAt,
                });

                hydrateGamification({
                    level: user.profile?.level || 1,
                    xp: user.profile?.currentXp || 0,
                    streak: user.profile?.streak || 0,
                });

                // As requested, redirect directly to dashboard
                router.push('/dashboard');
            } else {
                // Placeholder for actual login endpoint when built
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden px-4">
            {/* ── background orbs ── */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-teal-500/[0.08] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-violet-600/[0.08] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[150px] pointer-events-none" />

            {/* grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            {/* ── auth card ── */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="p-8 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40">

                    {/* logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex flex-col items-center gap-2 group">
                            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/15 transition-colors">
                                <Zap size={28} className="text-teal-400" />
                            </div>
                            <span className="text-lg font-black bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
                                FitForge
                            </span>
                        </Link>
                    </div>

                    {/* ── mode toggle ── */}
                    <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 mb-6">
                        {(['login', 'signup'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`relative flex-1 text-sm font-medium py-2 rounded-lg transition-colors duration-200 ${mode === m ? 'text-white' : 'text-white/35 hover:text-white/60'
                                    }`}
                            >
                                {mode === m && (
                                    <motion.div
                                        layoutId="auth-tab"
                                        className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">{m === 'login' ? 'Login' : 'Sign Up'}</span>
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    {/* ── form ── */}
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                variants={fadeSlide}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                {/* name — signup only */}
                                {mode === 'signup' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-white/40 font-medium">Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                            <Input
                                                type="text"
                                                placeholder="Your name"
                                                value={form.name}
                                                onChange={e => set('name', e.target.value)}
                                                required
                                                className="pl-10 h-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-400/20"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-white/40 font-medium">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                        <Input
                                            type="email"
                                            placeholder="hero@fitforge.com"
                                            value={form.email}
                                            onChange={e => set('email', e.target.value)}
                                            required
                                            className="pl-10 h-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-400/20"
                                        />
                                    </div>
                                </div>

                                {/* password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-white/40 font-medium">Password</label>
                                        {mode === 'login' && (
                                            <button type="button" className="text-[10px] text-teal-400/70 hover:text-teal-400 transition-colors">
                                                Forgot Password?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                        <Input
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={e => set('password', e.target.value)}
                                            required
                                            className="pl-10 pr-10 h-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-400/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                                        >
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 h-11 bg-gradient-to-r from-teal-500 to-violet-600 text-white border-0 font-bold text-sm hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all duration-300 group disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2">
                                {loading ? 'Forging...' : (mode === 'login' ? 'Enter the Forge' : 'Create Character')}
                                {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
                            </span>
                        </Button>
                    </form>

                    {/* ── divider ── */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    {/* ── social auth ── */}
                    <div className="space-y-2.5">
                        <button
                            type="button"
                            className="group w-full flex items-center justify-center gap-2.5 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 text-sm text-white/60 hover:text-white/80"
                        >
                            <Chrome size={16} className="text-white/30 group-hover:text-white/50 transition-colors" />
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            className="group w-full flex items-center justify-center gap-2.5 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 text-sm text-white/60 hover:text-white/80"
                        >
                            <Apple size={16} className="text-white/30 group-hover:text-white/50 transition-colors" />
                            Continue with Apple
                        </button>
                    </div>

                    {/* ── footer text ── */}
                    <p className="text-center text-[10px] text-white/15 mt-6 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-white/25 hover:text-white/40 underline underline-offset-2 transition-colors">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-white/25 hover:text-white/40 underline underline-offset-2 transition-colors">Privacy Policy</a>.
                    </p>
                </div>

                {/* bottom glow ring decoration */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-r from-teal-500/10 to-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            </motion.div>
        </div>
    );
}
