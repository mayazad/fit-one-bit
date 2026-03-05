import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Habit {
    id: string;
    title: string;
    icon: string; // e.g. "Droplets", "Book", "Moon"
    createdAt: string;
    completions: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

interface HabitStore {
    habits: Habit[];
    addHabit: (title: string, icon: string) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, dateStr: string) => void; // dateStr should be YYYY-MM-DD
    getStreak: (id: string) => number;
}

export const useHabitStore = create<HabitStore>()(
    persist(
        (set, get) => ({
            habits: [
                {
                    id: 'water-1',
                    title: 'Drink 3L Water',
                    icon: 'Droplets',
                    createdAt: new Date().toISOString(),
                    completions: []
                },
                {
                    id: 'read-1',
                    title: 'Read 10 pages',
                    icon: 'Book',
                    createdAt: new Date().toISOString(),
                    completions: []
                }
            ],

            addHabit: (title, icon) =>
                set((state) => ({
                    habits: [
                        ...state.habits,
                        {
                            id: `habit-${Date.now()}`,
                            title,
                            icon,
                            createdAt: new Date().toISOString(),
                            completions: []
                        }
                    ]
                })),

            deleteHabit: (id) =>
                set((state) => ({
                    habits: state.habits.filter(h => h.id !== id)
                })),

            toggleHabit: (id, dateStr) =>
                set((state) => ({
                    habits: state.habits.map(habit => {
                        if (habit.id === id) {
                            const isCompleted = habit.completions.includes(dateStr);
                            return {
                                ...habit,
                                completions: isCompleted
                                    ? habit.completions.filter(d => d !== dateStr)
                                    : [...habit.completions, dateStr]
                            };
                        }
                        return habit;
                    })
                })),

            getStreak: (id) => {
                const habit = get().habits.find(h => h.id === id);
                if (!habit || habit.completions.length === 0) return 0;

                // Sort completions descending
                const sortedDates = [...habit.completions].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                let streak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize to start of day
                const todayStr = today.toISOString().split('T')[0];

                // Check if missed today AND yesterday - means streak is broken
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
                    return 0;
                }

                // Calculate streak backwards
                let currentDate = new Date(sortedDates[0]); // Start with most recent completion

                for (let i = 0; i < sortedDates.length; i++) {
                    // If the diff between current expected continuous date and completion date is 0 days, increment
                    // (Allowing for initial gap if the streak just started counting from 'yesterday')

                    const expectedDateStr = currentDate.toISOString().split('T')[0];
                    if (sortedDates[i] === expectedDateStr) {
                        streak++;
                        // Move expected date back exactly one day
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else if (sortedDates[i] > expectedDateStr) {
                        // We somehow had multiple completions on same day? Ignore
                        continue;
                    } else {
                        // Broken sequence
                        break;
                    }
                }

                return streak;
            }
        }),
        { name: 'efit-habits' }
    )
);
