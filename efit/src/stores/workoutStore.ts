import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkoutDay } from '@/types';
import { defaultWeeklyPlan } from '@/data/plans';

interface WorkoutStore {
    weeklyPlan: WorkoutDay[];
    completedWorkouts: number;
    totalExercisesCompleted: number;
    toggleExercise: (dayIndex: number, exerciseId: string) => void;
    resetWeek: () => void;
    getToday: () => WorkoutDay | undefined;
}

const getDayIndex = () => new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

export const useWorkoutStore = create<WorkoutStore>()(
    persist(
        (set, get) => ({
            weeklyPlan: defaultWeeklyPlan.map(d => ({ ...d, completedExercises: [...d.completedExercises] })),
            completedWorkouts: 0,
            totalExercisesCompleted: 0,
            toggleExercise: (dayIndex, exerciseId) =>
                set((state) => {
                    const plan = [...state.weeklyPlan];
                    const day = { ...plan[dayIndex] };
                    const completed = [...day.completedExercises];
                    const idx = completed.indexOf(exerciseId);
                    let totalDelta = 0;

                    if (idx >= 0) {
                        completed.splice(idx, 1);
                        totalDelta = -1;
                    } else {
                        completed.push(exerciseId);
                        totalDelta = 1;
                    }

                    day.completedExercises = completed;
                    day.completed = completed.length === day.exercises.length && day.exercises.length > 0;
                    plan[dayIndex] = day;

                    const completedWorkouts = plan.filter((d) => d.completed).length;

                    return {
                        weeklyPlan: plan,
                        completedWorkouts,
                        totalExercisesCompleted: state.totalExercisesCompleted + totalDelta,
                    };
                }),
            resetWeek: () =>
                set({
                    weeklyPlan: defaultWeeklyPlan.map(d => ({
                        ...d,
                        completed: false,
                        completedExercises: [],
                    })),
                }),
            getToday: () => {
                const state = get();
                return state.weeklyPlan[getDayIndex()];
            },
        }),
        { name: 'efit-workout' }
    )
);
