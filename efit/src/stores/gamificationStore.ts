import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Badge } from '@/types';
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
    showLevelUpModal: boolean;
    recentlyUnlockedBadges: Badge[];
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    unlockBadge: (id: string) => void;
    addWater: () => void;
    removeWater: () => void;
    setSleep: (hours: number) => void;
    clearLevelUpModal: () => void;
    clearRecentlyUnlockedBadges: () => void;
    checkBadges: () => void;
    recordDailyLogin: () => void;
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
            showLevelUpModal: false,
            recentlyUnlockedBadges: [],
            addXp: (amount) =>
                set((state) => {
                    let newXp = state.xp + amount;
                    let newLevel = state.level;
                    let xpNeeded = getXpForLevel(newLevel);
                    let leveledUp = false;

                    while (newXp >= xpNeeded) {
                        newXp -= xpNeeded;
                        newLevel++;
                        xpNeeded = getXpForLevel(newLevel);
                        leveledUp = true;
                    }

                    return { xp: newXp, level: newLevel, showLevelUpModal: leveledUp ? true : state.showLevelUpModal };
                }),
            incrementStreak: () =>
                set((state) => ({
                    streak: state.streak + 1,
                    longestStreak: Math.max(state.longestStreak, state.streak + 1),
                    lastActiveDate: new Date().toISOString().split('T')[0],
                })),
            resetStreak: () => set({ streak: 0 }),
            unlockBadge: (id) =>
                set((state) => {
                    const badge = state.badges.find(b => b.id === id);
                    if (badge && !badge.unlocked) {
                        return {
                            badges: state.badges.map((b) =>
                                b.id === id ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
                            ),
                            recentlyUnlockedBadges: [...state.recentlyUnlockedBadges, { ...badge, unlocked: true }]
                        };
                    }
                    return state;
                }),
            addWater: () => set((state) => ({ waterGlasses: Math.min(state.waterGlasses + 1, 15) })),
            removeWater: () => set((state) => ({ waterGlasses: Math.max(state.waterGlasses - 1, 0) })),
            setSleep: (hours) => set({ sleepHours: hours }),
            clearLevelUpModal: () => set({ showLevelUpModal: false }),
            clearRecentlyUnlockedBadges: () => set({ recentlyUnlockedBadges: [] }),
            checkBadges: () => {
                const state = get();
                const unlock = get().unlockBadge;

                if (state.streak >= 3) unlock('streak-3');
                if (state.streak >= 7) unlock('streak-7');
                if (state.streak >= 14) unlock('streak-14');
                if (state.streak >= 30) unlock('streak-30');

                if (state.level >= 5) unlock('level-5');
                if (state.level >= 10) unlock('level-10');

                if (state.xp >= 1000) unlock('xp-1000');
                if (state.xp >= 5000) unlock('xp-5000');
            },
            recordDailyLogin: () => {
                const today = new Date().toISOString().split('T')[0];
                const lastActive = get().lastActiveDate;
                if (lastActive !== today) {
                    // It's a new day! Give daily login XP
                    get().addXp(20);
                    set({ lastActiveDate: today });
                    get().checkBadges();
                }
            },
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
        { name: 'efit-gamification' }
    )
);
