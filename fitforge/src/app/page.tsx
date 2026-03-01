'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Bot, Trophy, Dumbbell, Flame, Target, HeartPulse,
  ChevronRight, Activity, Footprints, TrendingUp, UtensilsCrossed,
  Sparkles, Moon, ArrowRight, Menu, X, Move,
} from 'lucide-react';

/* ───── animation helpers ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const avatarStages = [
  { src: '/avatars/stage-1.png', label: 'Novice' },
  { src: '/avatars/stage-2.png', label: 'Warrior' },
  { src: '/avatars/stage-3.png', label: 'Champion' },
  { src: '/avatars/stage-4.png', label: 'Legend' },
];

/* ───── nav links ───── */
const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Transform', href: '#transform' },
];

export default function LandingPage() {
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* avatar carousel timer */
  useEffect(() => {
    const id = setInterval(() => setActiveAvatar(p => (p + 1) % avatarStages.length), 2800);
    return () => clearInterval(id);
  }, []);

  /* navbar glass on scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ── gradient orbs (bg depth) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* ════════════════════════════════════════════
          NAVIGATION
      ════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
              <Zap size={20} className="text-teal-400" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
              FitForge
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* cta buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link
              href="/onboarding"
              className="relative text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 group"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Start Quest <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </Link>
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden text-white/70 hover:text-white">
            {mobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="block text-sm text-white/60 hover:text-white py-1.5">
                    {l.label}
                  </a>
                ))}
                <Link href="/onboarding" onClick={() => setMobileNav(false)} className="block w-full text-center text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white mt-3">
                  Start Quest
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* hero grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ── left: text ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs text-teal-400 font-medium mb-6">
                <Sparkles size={12} /> AI-Powered Fitness RPG
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                Level Up Your{' '}
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Real-Life
                </span>
                <br />
                Physique.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/50 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Stop tracking, start evolving. FitForge combines data-driven AI coaching with RPG gamification
                to transform your body, fix your posture, and build lasting habits.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/onboarding"
                  className="relative text-base font-bold px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Begin Your Journey <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* pulsing glow */}
                  <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 blur-xl -z-10"
                  />
                </Link>
                <a href="#features" className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors">
                  See features <ArrowRight size={14} />
                </a>
              </motion.div>

              {/* mini stats */}
              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                {[
                  { value: '150+', label: 'Exercises' },
                  { value: '7-Day', label: 'AI Plans' },
                  { value: 'RPG', label: 'Leveling' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/30">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── right: avatar evolution showcase ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              {/* glow ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-teal-500/10"
                  style={{ borderStyle: 'dashed' }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-teal-500/5 to-violet-600/5 blur-2xl" />
              </div>

              {/* avatar */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAvatar}
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={avatarStages[activeAvatar].src}
                      alt={avatarStages[activeAvatar].label}
                      fill
                      className="object-contain object-bottom drop-shadow-[0_0_40px_rgba(20,184,166,0.15)]"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* stage label */}
                <motion.div
                  key={`label-${activeAvatar}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs text-white/70 font-medium whitespace-nowrap"
                >
                  Stage {activeAvatar + 1}: {avatarStages[activeAvatar].label}
                </motion.div>
              </div>

              {/* stage dots */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {avatarStages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAvatar(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeAvatar ? 'bg-teal-400 w-6' : 'bg-white/20 hover:bg-white/40'
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/20">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 h-2 bg-teal-400/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES — BENTO GRID
      ════════════════════════════════════════════ */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-teal-400/80 mb-3">Features</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-4">
              Your Personal{' '}
              <span className="bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">AI Forge</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/40 max-w-md mx-auto">
              Everything you need to transform — intelligently crafted, beautifully gamified.
            </motion.p>
          </motion.div>

          {/* bento grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* card 1 — AI Coach (spans 2 on lg) */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 h-full flex flex-col group relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <Bot size={22} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Adaptive AI Coach</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-md">
                  Your plans evolve with you. The AI builds personalized workout routines for chest growth, belly fat loss, and posture correction — adjusting intensity based on your real progress.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {['Smart Scheduling', 'Progressive Overload', 'Recovery Aware'].map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300/80 border border-purple-500/15">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* card 2 — Gamification */}
            <motion.div
              variants={fadeUp}
              className="h-full flex flex-col group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <Trophy size={22} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">RPG Gamification</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Earn XP, unlock badges, maintain streaks, and watch your avatar evolve from Novice to Legend. Every rep counts.
                </p>
              </div>
            </motion.div>

            {/* card 3 — Targeted Transformation */}
            <motion.div
              variants={fadeUp}
              className="h-full flex flex-col group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <Move size={22} className="text-teal-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Targeted Transformation</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Posture correction, belly fat reduction, chest building, and flexibility — all baked into one holistic program.
                </p>
              </div>
            </motion.div>

            {/* card 4 — Diet Planning */}
            <motion.div
              variants={fadeUp}
              className="h-full flex flex-col group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <UtensilsCrossed size={22} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Smart Diet Planner</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Balanced, calorie-aware meals with local options. Track macros, protein, and calories with one tap.
                </p>
              </div>
            </motion.div>

            {/* card 5 — Progress (spans 2 on lg) */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 h-full flex flex-col group relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp size={22} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visual Progress Tracking</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-md">
                  Beautiful charts for weight, measurements, and body composition. See your transformation unfold week by week with data you can trust.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {['Weight Charts', 'Body Measurements', 'Streak History', 'XP Timeline'].map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300/80 border border-cyan-500/15">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-violet-400/80 mb-3">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-4">
              Three Steps to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Transformation</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                icon: Target,
                title: 'Set Your Goals',
                desc: 'Tell FitForge what you want — posture fix, muscle gain, fat loss, or all of the above. The AI builds your plan.',
                iconWrap: 'bg-teal-500/10 border-teal-500/20',
                iconColor: 'text-teal-400',
                stepColor: 'text-teal-500/[0.06]',
              },
              {
                step: '02',
                icon: Dumbbell,
                title: 'Train & Track',
                desc: 'Follow guided workouts, track each set, log your meals, and hydrate. Every action earns XP and grows your streak.',
                iconWrap: 'bg-violet-500/10 border-violet-500/20',
                iconColor: 'text-violet-400',
                stepColor: 'text-violet-500/[0.06]',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Level Up',
                desc: 'Watch your avatar evolve, unlock badges, and see your real transformation in charts. Consistency is the game.',
                iconWrap: 'bg-cyan-500/10 border-cyan-500/20',
                iconColor: 'text-cyan-400',
                stepColor: 'text-cyan-500/[0.06]',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="group relative text-center p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
              >
                <div className={`text-[64px] font-black ${item.stepColor} absolute top-4 right-6 leading-none select-none`}>
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.iconWrap} border flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon size={24} className={item.iconColor} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRANSFORMATION CTA
      ════════════════════════════════════════════ */}
      <section id="transform" className="relative py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-teal-500/10 via-violet-600/10 to-fuchsia-500/10 border border-white/[0.06] overflow-hidden"
          >
            {/* floating orbs */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div variants={fadeUp} className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium mb-6">
                <HeartPulse size={12} className="text-rose-400" /> Free to start, no credit card
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                Ready to Transform?
              </h2>
              <p className="text-white/40 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Join FitForge and start earning XP from your very first workout. Your Level 1 avatar is waiting.
              </p>
              <Link
                href="/onboarding"
                className="relative inline-flex items-center gap-2 text-base font-bold px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300 group"
              >
                Begin Your Journey <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 blur-xl -z-10"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-teal-400" />
              <span className="text-sm font-semibold text-white/60">FitForge</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact</a>
            </div>
            <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} FitForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
