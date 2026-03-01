import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';
import { useGamificationStore } from './gamificationStore';

interface UserStore {
    profile: UserProfile;
    isOnboarded: boolean;
    updateProfile: (updates: Partial<UserProfile>) => void;
    setOnboarded: (value: boolean) => void;
    setUserProfile: (profile: UserProfile) => void;
    completedDailyQuests: Record<string, string>;
    completeQuestLocally: (questId: string, xpAmount: number) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: {
                id: '',
                name: '',
                age: 0,
                height: '',
                weight: 0,
                goals: [],
                avatar: 'beginner',
                primaryClass: undefined,
                createdAt: new Date().toISOString(),
            },
            isOnboarded: false,
            updateProfile: (updates) =>
                set((state) => ({
                    profile: { ...state.profile, ...updates },
                })),
            setOnboarded: (value) => set({ isOnboarded: value }),
            setUserProfile: (profile) => set({ profile }),
            completedDailyQuests: {},
            completeQuestLocally: (questId, xpAmount) => {
                useGamificationStore.getState().addXp(xpAmount);
                const todayStr = new Date().toISOString().split('T')[0];
                set((state) => ({
                    completedDailyQuests: {
                        ...state.completedDailyQuests,
                        [questId]: todayStr,
                    },
                }));
            },
        }),
        { name: 'fitforge-user' }
    )
);
