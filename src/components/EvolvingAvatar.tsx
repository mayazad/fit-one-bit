'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface EvolvingAvatarProps {
    level: number;
}

export function EvolvingAvatar({ level }: EvolvingAvatarProps) {
    const getStage = (lvl: number) => {
        if (lvl <= 10) return { id: 1, name: 'Starting Out', description: 'Body Stage 1: Soft', gradient: 'from-slate-400 to-slate-600', imagePath: '/avatars/stage-1.svg' };
        if (lvl <= 25) return { id: 2, name: 'Leaning Down', description: 'Body Stage 2: Toned', gradient: 'from-cyan-400 to-blue-600', imagePath: '/avatars/stage-2.svg' };
        if (lvl <= 40) return { id: 3, name: 'Building Muscle', description: 'Body Stage 3: Muscular', gradient: 'from-violet-400 to-purple-600', imagePath: '/avatars/stage-3.svg' };
        return { id: 4, name: 'Goal Physique', description: 'Body Stage 4: Shredded', gradient: 'from-orange-400 to-red-600', imagePath: '/avatars/stage-4.svg' };
    };

    const stage = getStage(level);

    return (
        <div className="relative w-32 h-44 sm:w-40 sm:h-56 rounded-2xl p-[2px] cursor-pointer group flex-shrink-0 mt-2 sm:mt-0">
            {/* Outer neon glow ring */}
            <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${stage.gradient} opacity-50 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500`} />

            {/* Container */}
            <div className="relative w-full h-full rounded-[14px] bg-slate-900/80 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center border border-white/5 shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`w-full h-full flex flex-col items-center shadow-inner bg-gradient-to-br ${stage.gradient} bg-opacity-10`}
                    >
                        {/* Full-body visual */}
                        <div className="flex-1 flex items-center justify-center w-full relative p-4">
                            {/* Silhouette glow */}
                            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-full h-full z-10 drop-shadow-xl filter">
                                <Image
                                    src={stage.imagePath}
                                    alt={stage.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Label Base */}
                        <div className="bg-slate-950/80 backdrop-blur-md w-full p-2.5 sm:p-3 mt-auto border-t border-white/10 z-20">
                            <p className="text-[11px] sm:text-xs font-bold text-white mb-0.5 text-center truncate">{stage.name}</p>
                            <p className="text-[9px] sm:text-[10px] text-white/60 text-center truncate">{stage.description}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Level Badge Overlay */}
            <div className="absolute -top-3 -right-3 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl border border-white/10 z-30">
                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${stage.gradient} flex items-center justify-center text-xs sm:text-sm font-black text-white ring-2 ring-slate-900/50 shadow-inner`}>
                    {level}
                </div>
            </div>
        </div>
    );
}
