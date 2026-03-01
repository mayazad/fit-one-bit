export const defaultWeeklyPlan = [
    {
        day: 'Monday',
        isRestDay: false,
        exercises: ['push-ups', 'wide-push-ups', 'diamond-push-ups', 'plank', 'crunches'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Tuesday',
        isRestDay: false,
        exercises: ['squats', 'lunges', 'calf-raises', 'leg-raises', 'mountain-climbers'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Wednesday',
        isRestDay: false,
        exercises: ['wall-angels', 'chin-tucks', 'thoracic-extension', 'cat-cow-stretch', 'hip-flexor-stretch'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Thursday',
        isRestDay: false,
        exercises: ['decline-push-ups', 'incline-push-ups', 'bicycle-crunches', 'plank', 'high-knees'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Friday',
        isRestDay: false,
        exercises: ['jump-squats', 'burpees', 'jumping-jacks', 'mountain-climbers', 'leg-raises'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Saturday',
        isRestDay: false,
        exercises: ['hamstring-stretch', 'hip-flexor-stretch', 'cat-cow-stretch', 'kegel-exercises', 'dead-hang'],
        completed: false,
        completedExercises: [],
    },
    {
        day: 'Sunday',
        isRestDay: true,
        exercises: [],
        completed: false,
        completedExercises: [],
    },
];

export const defaultMealPlan: Record<string, { breakfast: string; lunch: string; snack: string; dinner: string }> = {
    Monday: { breakfast: 'egg-toast', lunch: 'rice-chicken', snack: 'peanut-banana', dinner: 'roti-chicken' },
    Tuesday: { breakfast: 'oats-breakfast', lunch: 'dal-rice', snack: 'yogurt-fruits', dinner: 'soup-bread' },
    Wednesday: { breakfast: 'paratha-egg', lunch: 'fish-curry', snack: 'muri-mix', dinner: 'khichuri' },
    Thursday: { breakfast: 'smoothie-bowl', lunch: 'chicken-salad', snack: 'boiled-eggs-snack', dinner: 'egg-fried-rice' },
    Friday: { breakfast: 'egg-toast', lunch: 'rice-chicken', snack: 'peanut-banana', dinner: 'roti-chicken' },
    Saturday: { breakfast: 'oats-breakfast', lunch: 'fish-curry', snack: 'yogurt-fruits', dinner: 'soup-bread' },
    Sunday: { breakfast: 'paratha-egg', lunch: 'dal-rice', snack: 'muri-mix', dinner: 'khichuri' },
};
