import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProgressEntry } from '@/types';

interface ProgressStore {
    entries: ProgressEntry[];
    addEntry: (entry: ProgressEntry) => void;
    getLatest: () => ProgressEntry | null;
    getWeeklyData: () => ProgressEntry[];
}

export const useProgressStore = create<ProgressStore>()(
    persist(
        (set, get) => ({
            entries: [
                { date: '2026-02-20', weight: 57, chest: 36, waist: 32 },
                { date: '2026-02-22', weight: 56.8, chest: 36, waist: 31.8 },
                { date: '2026-02-24', weight: 56.5, chest: 36.2, waist: 31.5 },
                { date: '2026-02-26', weight: 56.2, chest: 36.5, waist: 31.2 },
                { date: '2026-02-28', weight: 56, chest: 36.5, waist: 31 },
                { date: '2026-03-01', weight: 55.8, chest: 37, waist: 30.8 },
            ],
            addEntry: (entry) =>
                set((state) => ({
                    entries: [...state.entries, entry].sort((a, b) => a.date.localeCompare(b.date)),
                })),
            getLatest: () => {
                const entries = get().entries;
                return entries.length > 0 ? entries[entries.length - 1] : null;
            },
            getWeeklyData: () => {
                return get().entries.slice(-7);
            },
        }),
        { name: 'fitforge-progress' }
    )
);
