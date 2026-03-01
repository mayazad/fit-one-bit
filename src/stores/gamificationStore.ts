import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Badge, Quest } from '@/types';
import { defaultBadges, getXpForLevel, getAvatarForLevel } from '@/data/gamification';

interface GamificationStore {
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    badges: Badge[];
    waterGlasses: number;
    waterGoal: number;
    sleepHours: number;
    lastActiveDate: string;
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    unlockBadge: (id: string) => void;
    addWater: () => void;
    removeWater: () => void;
    setSleep: (hours: number) => void;
    getProgress: () => { xp: number; xpNeeded: number; percentage: number };
    getAvatarStage: () => ReturnType<typeof getAvatarForLevel>;
    hydrateGamification: (data: Partial<GamificationStore>) => void;
}

export const useGamificationStore = create<GamificationStore>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            longestStreak: 0,
            badges: defaultBadges.map((b) => ({ ...b, unlocked: false })),
            waterGlasses: 0,
            waterGoal: 8,
            sleepHours: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            addXp: (amount) =>
                set((state) => {
                    let newXp = state.xp + amount;
                    let newLevel = state.level;
                    let xpNeeded = getXpForLevel(newLevel);

                    while (newXp >= xpNeeded) {
                        newXp -= xpNeeded;
                        newLevel++;
                        xpNeeded = getXpForLevel(newLevel);
                    }

                    return { xp: newXp, level: newLevel };
                }),
            incrementStreak: () =>
                set((state) => ({
                    streak: state.streak + 1,
                    longestStreak: Math.max(state.longestStreak, state.streak + 1),
                    lastActiveDate: new Date().toISOString().split('T')[0],
                })),
            resetStreak: () => set({ streak: 0 }),
            unlockBadge: (id) =>
                set((state) => ({
                    badges: state.badges.map((b) =>
                        b.id === id ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
                    ),
                })),
            addWater: () => set((state) => ({ waterGlasses: Math.min(state.waterGlasses + 1, 15) })),
            removeWater: () => set((state) => ({ waterGlasses: Math.max(state.waterGlasses - 1, 0) })),
            setSleep: (hours) => set({ sleepHours: hours }),
            getProgress: () => {
                const { xp, level } = get();
                const xpNeeded = getXpForLevel(level);
                return { xp, xpNeeded, percentage: Math.round((xp / xpNeeded) * 100) };
            },
            getAvatarStage: () => {
                return getAvatarForLevel(get().level);
            },
            hydrateGamification: (data) => set((state) => ({ ...state, ...data })),
        }),
        { name: 'fitforge-gamification' }
    )
);
