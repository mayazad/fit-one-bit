import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface UserStore {
    profile: UserProfile;
    isOnboarded: boolean;
    updateProfile: (updates: Partial<UserProfile>) => void;
    setOnboarded: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: {
                name: 'Fitness Warrior',
                age: 25,
                height: "5'3\"",
                weight: 56,
                goals: [
                    'Lose belly fat',
                    'Reduce chest fat',
                    'Build wider chest',
                    'Gain lean muscle',
                    'Improve posture',
                    'Improve stamina',
                ],
                avatar: 'beginner',
                createdAt: new Date().toISOString(),
            },
            isOnboarded: false,
            updateProfile: (updates) =>
                set((state) => ({
                    profile: { ...state.profile, ...updates },
                })),
            setOnboarded: (value) => set({ isOnboarded: value }),
        }),
        { name: 'fitforge-user' }
    )
);
