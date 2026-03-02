import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGamificationStore } from './gamificationStore';

export interface SleepRecord {
    id: string;
    date: string; // YYYY-MM-DD
    hours: number;
    quality: number; // 1-5 stars
}

interface SleepStore {
    records: SleepRecord[];
    addRecord: (hours: number, quality: number) => void;
    getTodayRecord: () => SleepRecord | undefined;
    getAverageSleep: () => number;
}

export const useSleepStore = create<SleepStore>()(
    persist(
        (set, get) => ({
            // Prefill with some mock data for the last 7 days so charts look good
            records: Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (7 - i)); // Past 7 days
                return {
                    id: `mock-${i}`,
                    date: d.toISOString().split('T')[0],
                    hours: Math.floor(Math.random() * (9 - 5 + 1) + 5), // Random 5-9 hours
                    quality: Math.floor(Math.random() * 5) + 1, // 1-5
                };
            }),

            addRecord: (hours, quality) => {
                const today = new Date().toISOString().split('T')[0];

                set((state) => {
                    // Update existing today's record if it exists, otherwise add new
                    const existingIndex = state.records.findIndex(r => r.date === today);
                    const newRecords = [...state.records];

                    if (existingIndex >= 0) {
                        newRecords[existingIndex] = { ...newRecords[existingIndex], hours, quality };
                    } else {
                        newRecords.push({
                            id: `sleep-${Date.now()}`,
                            date: today,
                            hours,
                            quality
                        });
                    }

                    return { records: newRecords };
                });

                // Sync with Dashboard gamification store (simplistic link for dashboard view)
                useGamificationStore.getState().setSleep(hours);
            },

            getTodayRecord: () => {
                const today = new Date().toISOString().split('T')[0];
                return get().records.find(r => r.date === today);
            },

            getAverageSleep: () => {
                const all = get().records;
                if (all.length === 0) return 0;

                // Get avg of last 7 days max
                const recent = all.slice(-7);
                const sum = recent.reduce((acc, curr) => acc + curr.hours, 0);
                return Number((sum / recent.length).toFixed(1));
            }
        }),
        { name: 'efit-sleep' }
    )
);
