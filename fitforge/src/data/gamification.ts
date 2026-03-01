export const motivationalQuotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "Don't wish for a good body, work for it.", author: "Unknown" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
    { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "A champion is someone who gets up when they can't.", author: "Jack Dempsey" },
    { text: "The hardest lift of all is lifting your butt off the couch.", author: "Unknown" },
    { text: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa" },
    { text: "Discipline is doing what needs to be done, even when you don't feel like it.", author: "Unknown" },
    { text: "Your health is an investment, not an expense.", author: "Unknown" },
    { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
    { text: "Little by little, a little becomes a lot.", author: "Tanzanian Proverb" },
];

export function getDailyQuote() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
}

export const defaultBadges = [
    { id: 'first-workout', name: 'First Steps', description: 'Complete your first workout', icon: 'target', requirement: 'Complete 1 workout', unlocked: false },
    { id: 'streak-3', name: 'On Fire', description: '3-day workout streak', icon: 'flame', requirement: '3-day streak', unlocked: false },
    { id: 'streak-7', name: 'Iron Will', description: '7-day workout streak', icon: 'zap', requirement: '7-day streak', unlocked: false },
    { id: 'streak-14', name: 'Unstoppable', description: '14-day workout streak', icon: 'dumbbell', requirement: '14-day streak', unlocked: false },
    { id: 'streak-30', name: 'Legendary', description: '30-day workout streak', icon: 'trophy', requirement: '30-day streak', unlocked: false },
    { id: 'level-5', name: 'Rising Warrior', description: 'Reach Level 5', icon: 'sword', requirement: 'Level 5', unlocked: false },
    { id: 'level-10', name: 'Champion', description: 'Reach Level 10', icon: 'crown', requirement: 'Level 10', unlocked: false },
    { id: 'meals-7', name: 'Clean Eater', description: 'Track meals for 7 days', icon: 'salad', requirement: '7 days of meal tracking', unlocked: false },
    { id: 'water-master', name: 'Hydrated', description: 'Hit water goal 7 days in a row', icon: 'droplets', requirement: '7-day water streak', unlocked: false },
    { id: 'all-categories', name: 'Well Rounded', description: 'Complete exercises from all categories', icon: 'star', requirement: 'All categories done', unlocked: false },
    { id: 'xp-1000', name: 'XP Hunter', description: 'Earn 1000 total XP', icon: 'sparkles', requirement: '1000 XP', unlocked: false },
    { id: 'xp-5000', name: 'XP Master', description: 'Earn 5000 total XP', icon: 'gem', requirement: '5000 XP', unlocked: false },
    { id: 'early-bird', name: 'Early Bird', description: 'Log activity before 7 AM', icon: 'sunrise', requirement: 'Activity before 7 AM', unlocked: false },
    { id: 'fleximaster', name: 'Flexible', description: 'Complete 10 flexibility exercises', icon: 'activity', requirement: '10 flexibility workouts', unlocked: false },
    { id: 'posture-pro', name: 'Posture Pro', description: 'Complete 10 posture exercises', icon: 'shield', requirement: '10 posture workouts', unlocked: false },
];

export const avatarStages = [
    { level: 0, stage: 'beginner', name: 'Novice', description: 'Just getting started' },
    { level: 5, stage: 'rookie', name: 'Rookie', description: 'Building momentum' },
    { level: 10, stage: 'warrior', name: 'Warrior', description: 'Strong and determined' },
    { level: 20, stage: 'champion', name: 'Champion', description: 'Elite performer' },
    { level: 35, stage: 'legend', name: 'Legend', description: 'Transcended limits' },
];

export function getAvatarForLevel(level: number) {
    let current = avatarStages[0];
    for (const stage of avatarStages) {
        if (level >= stage.level) current = stage;
    }
    return current;
}

export function getXpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.3, level));
}
