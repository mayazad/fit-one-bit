import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultMealPlan } from '@/data/plans';

interface MealCompletion {
    breakfast: boolean;
    lunch: boolean;
    snack: boolean;
    dinner: boolean;
}

interface DietStore {
    mealPlan: Record<string, { breakfast: string; lunch: string; snack: string; dinner: string }>;
    completion: Record<string, MealCompletion>;
    toggleMeal: (day: string, mealType: keyof MealCompletion) => void;
    swapMeal: (day: string, mealType: keyof MealCompletion, newMealId: string) => void;
    getTodayCompletion: () => MealCompletion;
    getCompletedMealsCount: () => number;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getToday = () => days[new Date().getDay()];

const defaultCompletion: Record<string, MealCompletion> = {};
days.forEach((d) => {
    defaultCompletion[d] = { breakfast: false, lunch: false, snack: false, dinner: false };
});

export const useDietStore = create<DietStore>()(
    persist(
        (set, get) => ({
            mealPlan: defaultMealPlan,
            completion: { ...defaultCompletion },
            toggleMeal: (day, mealType) =>
                set((state) => {
                    const comp = { ...state.completion };
                    comp[day] = { ...comp[day], [mealType]: !comp[day][mealType] };
                    return { completion: comp };
                }),
            swapMeal: (day, mealType, newMealId) =>
                set((state) => {
                    const newPlan = { ...state.mealPlan };
                    if (newPlan[day]) {
                        newPlan[day] = { ...newPlan[day], [mealType]: newMealId };
                    }
                    return { mealPlan: newPlan };
                }),
            getTodayCompletion: () => {
                const state = get();
                return state.completion[getToday()] || { breakfast: false, lunch: false, snack: false, dinner: false };
            },
            getCompletedMealsCount: () => {
                const state = get();
                let count = 0;
                Object.values(state.completion).forEach((c) => {
                    if (c.breakfast) count++;
                    if (c.lunch) count++;
                    if (c.snack) count++;
                    if (c.dinner) count++;
                });
                return count;
            },
        }),
        { name: 'efit-diet' }
    )
);
