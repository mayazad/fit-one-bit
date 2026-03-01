// ===== USER PROFILE =====
export interface UserProfile {
    id: string;
    name: string;
    age: number;
    height: string;
    weight: number;
    goals: string[];
    avatar: AvatarStage;
    primaryClass?: string;
    createdAt: string;
}

export type AvatarStage = 'beginner' | 'rookie' | 'warrior' | 'champion' | 'legend';

// ===== EXERCISES =====
export type MuscleGroup = 'chest' | 'core' | 'legs' | 'back' | 'shoulders' | 'arms' | 'full-body' | 'flexibility' | 'posture' | 'performance';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
    id: string;
    name: string;
    category: MuscleGroup;
    muscles: string[];
    difficulty: Difficulty;
    sets: number;
    reps: string;
    duration?: string;
    instructions: string[];
    benefits: string[];
    commonMistakes: string[];
    icon: string;
    calories: number;
}

// ===== WORKOUT PLAN =====
export interface WorkoutDay {
    day: string;
    isRestDay: boolean;
    exercises: string[]; // exercise IDs
    completed: boolean;
    completedExercises: string[];
}

export interface WeeklyPlan {
    weekNumber: number;
    days: WorkoutDay[];
    startDate: string;
}

// ===== DIET =====
export interface Meal {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    ingredients: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    preparation: string;
    isLocal: boolean;
}

export interface DailyMealPlan {
    date: string;
    meals: {
        breakfast: string; // meal ID
        lunch: string;
        snack: string;
        dinner: string;
    };
    completed: {
        breakfast: boolean;
        lunch: boolean;
        snack: boolean;
        dinner: boolean;
    };
}

// ===== PROGRESS =====
export interface ProgressEntry {
    date: string;
    weight?: number;
    chest?: number;
    waist?: number;
    notes?: string;
}

// ===== GAMIFICATION =====
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: string;
    unlocked: boolean;
    unlockedAt?: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    type: 'workout' | 'diet' | 'water' | 'streak';
}

export interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    badges: Badge[];
    todayQuests: Quest[];
    lastActiveDate: string;
}

// ===== AI CHAT =====
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// ===== TRACKERS =====
export interface WaterLog {
    date: string;
    glasses: number;
    goal: number;
}

export interface SleepLog {
    date: string;
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface HabitEntry {
    id: string;
    name: string;
    icon: string;
    completed: boolean;
}
