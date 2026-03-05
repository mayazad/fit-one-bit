'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface EvolvingAvatarProps {
    level: number;
}

export function EvolvingAvatar({ level }: EvolvingAvatarProps) {
    const getStage = (lvl: number) => {
        if (lvl <= 10) return { id: 1, name: 'Starting Out', description: 'Body Stage 1: Soft', gradient: 'from-slate-400 to-slate-600', imagePath: '/avatars/stage-1.png' };
        if (lvl <= 25) return { id: 2, name: 'Leaning Down', description: 'Body Stage 2: Toned', gradient: 'from-orange-400 to-blue-600', imagePath: '/avatars/stage-2.png' };
        if (lvl <= 40) return { id: 3, name: 'Building Muscle', description: 'Body Stage 3: Muscular', gradient: 'from-orange-400 to-orange-600', imagePath: '/avatars/stage-3.png' };
        return { id: 4, name: 'Goal Physique', description: 'Body Stage 4: Shredded', gradient: 'from-orange-400 to-red-600', imagePath: '/avatars/stage-4.png' };
    };

    const stage = getStage(level);

    return (
        <div className="absolute bottom-0 left-0 w-full h-full flex-shrink-0 group z-10 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-end"
                >
                    {/* Character Visual */}
                    <div className="absolute inset-x-0 bottom-0 w-full h-full z-10 ">
                        {/* Soft behind glow matching outfit */}
                        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-t ${stage.gradient} opacity-20 blur-[40px] rounded-full pointer-events-none`} />
                        <Image
                            src={stage.imagePath}
                            alt={stage.name}
                            fill
                            className="object-contain object-bottom scale-125 lg:scale-125 origin-bottom"
                            priority
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
