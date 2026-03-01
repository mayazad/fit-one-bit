'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/stores/chatStore';

const suggestions = [
    'What workout should I do today?',
    'How can I reduce belly fat?',
    'Give me diet tips for muscle gain',
    'How to fix my posture?',
    'I missed 2 days, what should I do?',
    'Motivate me!',
];

export default function AiCoachPage() {
    const { messages, sendMessage, clearChat } = useChatStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput('');
    };

    const handleSuggestion = (text: string) => {
        sendMessage(text);
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                            AI Coach <Sparkles size={20} className="text-cyan-400" />
                        </h1>
                        <p className="text-sm text-muted-foreground">Your personal fitness & nutrition advisor 🤖</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearChat} className="text-xs border-white/10">
                        <Trash2 size={14} className="mr-1" /> Clear
                    </Button>
                </div>
            </motion.div>

            {/* Chat Messages */}
            <Card className="glass-card border-white/5 flex-1 flex flex-col overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-cyan-500 to-violet-600 text-white'
                                    : 'bg-white/10'
                                }`}>
                                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-500/20'
                                    : 'bg-white/5 border border-white/5'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <p className="text-[10px] text-muted-foreground mt-1.5">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Suggestions */}
                {messages.length <= 2 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleSuggestion(s)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask your AI coach anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="bg-white/5 border-white/10"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-0 px-4"
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
