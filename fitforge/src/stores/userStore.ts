import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface UserStore {
    profile: UserProfile;
    isOnboarded: boolean;
    updateProfile: (updates: Partial<UserProfile>) => void;
    setOnboarded: (value: boolean) => void;
    setUserProfile: (profile: UserProfile) => void;
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
        }),
        { name: 'fitforge-user' }
    )
);
