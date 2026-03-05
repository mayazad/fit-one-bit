export interface FlexibilityExercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    type: 'timed' | 'reps';
}

export interface FlexibilityRoutine {
    id: string;
    title: string;
    duration: string;
    difficulty: string;
    calories: string;
    image: string;
    exercises: FlexibilityExercise[];
}

export const flexibilityRoutines: FlexibilityRoutine[] = [
    {
        id: 'flex-1',
        title: 'Morning Yoga Flow',
        duration: '15 min',
        difficulty: 'Beginner',
        calories: '80',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', // Yoga mat stretch
        exercises: [
            { id: 'ex-y1', name: 'Child\'s Pose', sets: 1, reps: '60s', type: 'timed' },
            { id: 'ex-y2', name: 'Cat-Cow', sets: 1, reps: '10', type: 'reps' },
            { id: 'ex-y3', name: 'Downward Dog', sets: 1, reps: '60s', type: 'timed' }
        ]
    },
    {
        id: 'flex-2',
        title: 'Desk Worker Relief',
        duration: '10 min',
        difficulty: 'Beginner',
        calories: '50',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600&auto=format&fit=crop', // Office stretching
        exercises: [
            { id: 'ex-d1', name: 'Neck Rolls', sets: 1, reps: '10', type: 'reps' },
            { id: 'ex-d2', name: 'Seated Spinal Twist', sets: 1, reps: '30s', type: 'timed' },
            { id: 'ex-d3', name: 'Chest Opener', sets: 1, reps: '30s', type: 'timed' }
        ]
    },
    {
        id: 'flex-3',
        title: 'Full Body Dynamic Warmup',
        duration: '12 min',
        difficulty: 'Intermediate',
        calories: '100',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop', // Dynamic stretching
        exercises: [
            { id: 'ex-w1', name: 'Arm Circles', sets: 1, reps: '20', type: 'reps' },
            { id: 'ex-w2', name: 'Leg Swings', sets: 1, reps: '20', type: 'reps' },
            { id: 'ex-w3', name: 'Hip Rotations', sets: 1, reps: '15', type: 'reps' }
        ]
    }
];
