'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Star, BedDouble, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSleepStore } from '@/stores/sleepStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

export default function SleepPage() {
    const { records, addRecord, getTodayRecord, getAverageSleep } = useSleepStore();
    const todayRecord = getTodayRecord();

    const [hours, setHours] = useState(todayRecord?.hours || 7);
    const [quality, setQuality] = useState(todayRecord?.quality || 3);

    const handleSave = () => {
        addRecord(hours, quality);
    };

    // Format data for chart
    const chartData = records.slice(-7).map(r => {
        const d = new Date(r.date);
        return {
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: r.date,
            hours: r.hours,
            quality: r.quality
        };
    });

    const averageSleep = getAverageSleep();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Sleep Tracker</h1>
                    <p className="text-sm text-muted-foreground">Monitor your recovery and rest.</p>
                </div>
                <div className="bg-sky-500/10 text-sky-400 px-3 py-1.5 rounded-full text-sm font-semibold border border-sky-500/20 flex items-center gap-2">
                    <Moon size={14} /> Avg: {averageSleep}h
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Card */}
                <Card className="glass-card border-sky-500/30 md:col-span-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-sky-400">
                            <BedDouble size={20} /> Log Sleep
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-zinc-300">Duration</label>
                                <span className="text-xl font-bold text-white">{hours} <span className="text-sm text-zinc-500 font-normal">hrs</span></span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="14"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(parseFloat(e.target.value))}
                                className="w-full accent-sky-500 bg-zinc-800 rounded-lg h-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-300 mb-2 block">Quality</label>
                            <div className="flex gap-2 justify-between">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setQuality(star)}
                                        className={`p-2 transition-all rounded-lg ${quality >= star
                                            ? 'text-yellow-400 scale-110'
                                            : 'text-zinc-600 hover:text-yellow-400/50'
                                            }`}
                                    >
                                        <Star size={24} fill={quality >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all"
                        >
                            {todayRecord ? 'Update Record' : 'Save Sleep'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Chart Card */}
                <Card className="glass-card border-zinc-800/50 md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-zinc-200">This Week's Rest</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 12]}
                                        ticks={[0, 4, 8, 12]}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                        itemStyle={{ color: '#0ea5e9' }}
                                        formatter={(value: any) => [`${value} hrs`, 'Duration']}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hours"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorHours)"
                                        activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insight Card */}
            {averageSleep < 7 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4 mt-6">
                        <AlertCircle className="text-amber-500 shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-amber-500">Recovery Warning</h4>
                            <p className="text-sm text-zinc-300 mt-1">Your average sleep ({averageSleep}h) is below the recommended 7-9 hours. Consider setting an earlier bedtime tonight to boost your workout recovery.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
