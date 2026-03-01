import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types';

const aiResponses: Record<string, string[]> = {
    workout: [
        "Based on your progress, I recommend focusing on compound movements today. Try push-ups, squats, and planks for a balanced workout! 💪",
        "You've been doing great with chest exercises! Let's add some core work to help with belly fat reduction. Mountain climbers and bicycle crunches would be perfect.",
        "Remember, consistency beats intensity. Even a 20-minute workout is better than skipping entirely! Keep that streak going! 🔥",
    ],
    diet: [
        "For your goals of losing belly fat while building muscle, aim for 1.6-2g of protein per kg of body weight. That's about 90-112g protein daily for you!",
        "Try having your protein-rich meals within 2 hours of your workout for optimal muscle recovery. Eggs and chicken are excellent choices! 🥚",
        "Budget tip: Eggs, lentils (dal), and peanuts are some of the cheapest high-protein options. Mix them throughout the day for complete nutrition.",
    ],
    motivation: [
        "You've been consistent for {streak} days! That's incredible discipline. Every day you show up, you're building the body you want. 🌟",
        "Remember why you started this journey. Visualize your transformed physique — wider chest, flatter belly, better posture. You're getting there!",
        "Progress isn't always visible in the mirror, but it's happening inside. Your muscles are getting stronger, your endurance is improving. Trust the process! 💯",
    ],
    progress: [
        "Looking at your data, you've lost about 1.2kg this month while maintaining muscle. That's the perfect rate for sustainable fat loss! 📊",
        "Your consistency rate this week is impressive! Keep tracking your measurements — chest should gradually increase while waist decreases.",
        "I notice you might benefit from more flexibility work. Adding 10 minutes of stretching after workouts can improve recovery by 30%!",
    ],
    posture: [
        "For someone who sits a lot, wall angels and chin tucks should be done twice daily. Try setting reminders — one morning, one evening!",
        "Your thoracic spine might need extra attention. The cat-cow stretch combined with thoracic extensions can make a huge difference in posture.",
        "Good posture actually helps your workouts be more effective! When you stand taller, your chest exercises target the right muscles better.",
    ],
    default: [
        "I'm here to help you with your fitness journey! You can ask me about workouts, diet, progress, or just chat for motivation. 😊",
        "Let me check your recent activity... Based on your patterns, I have some personalized suggestions. What would you like to focus on?",
        "Great question! Here's what I recommend based on your profile and goals. Would you like more specific advice on workout plans or nutrition?",
    ],
};

function getAiResponse(message: string): string {
    const lower = message.toLowerCase();
    let category = 'default';

    if (lower.includes('workout') || lower.includes('exercise') || lower.includes('train')) {
        category = 'workout';
    } else if (lower.includes('diet') || lower.includes('food') || lower.includes('eat') || lower.includes('meal') || lower.includes('protein') || lower.includes('nutrition')) {
        category = 'diet';
    } else if (lower.includes('motivat') || lower.includes('tired') || lower.includes('give up') || lower.includes('hard') || lower.includes('miss')) {
        category = 'motivation';
    } else if (lower.includes('progress') || lower.includes('weight') || lower.includes('measure') || lower.includes('track') || lower.includes('result')) {
        category = 'progress';
    } else if (lower.includes('posture') || lower.includes('back') || lower.includes('sit') || lower.includes('stretch') || lower.includes('flex')) {
        category = 'posture';
    }

    const responses = aiResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

interface ChatStore {
    messages: ChatMessage[];
    sendMessage: (content: string) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            messages: [
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: "Hey there, warrior! 🏋️ I'm your AI Fitness Coach. I can help you with workout plans, diet tips, progress analysis, and motivation. What would you like to work on today?",
                    timestamp: new Date().toISOString(),
                },
            ],
            sendMessage: (content) =>
                set((state) => {
                    const userMsg: ChatMessage = {
                        id: `user-${Date.now()}`,
                        role: 'user',
                        content,
                        timestamp: new Date().toISOString(),
                    };
                    const aiMsg: ChatMessage = {
                        id: `ai-${Date.now()}`,
                        role: 'assistant',
                        content: getAiResponse(content),
                        timestamp: new Date().toISOString(),
                    };
                    return { messages: [...state.messages, userMsg, aiMsg] };
                }),
            clearChat: () =>
                set({
                    messages: [
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content: "Chat cleared! How can I help you today? 💪",
                            timestamp: new Date().toISOString(),
                        },
                    ],
                }),
        }),
        { name: 'fitforge-chat' }
    )
);
