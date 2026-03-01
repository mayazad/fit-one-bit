'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Plus, Scale, Ruler, Weight, Maximize2, Ratio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProgressStore } from '@/stores/progressStore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5 },
    }),
};

export default function ProgressPage() {
    const { entries, addEntry, getLatest } = useProgressStore();
    const latest = getLatest();
    const [showForm, setShowForm] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [newChest, setNewChest] = useState('');
    const [newWaist, setNewWaist] = useState('');

    const handleAdd = () => {
        if (!newWeight) return;
        addEntry({
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(newWeight) || undefined,
            chest: parseFloat(newChest) || undefined,
            waist: parseFloat(newWaist) || undefined,
        });
        setNewWeight('');
        setNewChest('');
        setNewWaist('');
        setShowForm(false);
    };

    const weightChange = entries.length >= 2
        ? (entries[entries.length - 1].weight ?? 0) - (entries[0].weight ?? 0)
        : 0;

    const chartData = entries.map(e => ({
        date: e.date.slice(5),
        weight: e.weight,
        chest: e.chest,
        waist: e.waist,
    }));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Progress Tracker</h1>
                        <p className="text-sm text-muted-foreground">Visualize your transformation journey.</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all text-zinc-50 border-0"
                        size="sm"
                    >
                        <Plus size={16} className="mr-1" /> Log Entry
                    </Button>
                </div>
            </motion.div>

            {/* Add Entry Form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Card className="glass-card border-zinc-800/50">
                        <CardContent className="p-4">
                            <div className="grid sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="56.0"
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-800/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Chest (inches)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="36.0"
                                        value={newChest}
                                        onChange={(e) => setNewChest(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-800/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Waist (inches)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="31.0"
                                        value={newWaist}
                                        onChange={(e) => setNewWaist(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-800/50"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleAdd} className="mt-3 w-full sm:w-auto" size="sm">
                                Save Entry
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Current Weight',
                        value: latest?.weight ? `${latest.weight} kg` : '—',
                        icon: Scale,
                        color: 'text-orange-400',
                        bg: 'from-orange-500/10 to-blue-500/10',
                    },
                    {
                        label: 'Weight Change',
                        value: weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : '—',
                        icon: weightChange <= 0 ? TrendingDown : TrendingUp,
                        color: weightChange <= 0 ? 'text-emerald-400' : 'text-red-400',
                        bg: weightChange <= 0 ? 'from-emerald-500/10 to-green-500/10' : 'from-red-500/10 to-rose-500/10',
                    },
                    {
                        label: 'Chest',
                        value: latest?.chest ? `${latest.chest}"` : '—',
                        icon: Maximize2,
                        color: 'text-orange-400',
                        bg: 'from-orange-500/10 to-orange-500/10',
                    },
                    {
                        label: 'Waist',
                        value: latest?.waist ? `${latest.waist}"` : '—',
                        icon: Ratio,
                        color: 'text-orange-400',
                        bg: 'from-orange-500/10 to-orange-500/10',
                    },
                ].map((stat, i) => (
                    <motion.div key={stat.label} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className={`group bg-gradient-to-br ${stat.bg} border-zinc-800/50`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon size={16} className={`${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                                </div>
                                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Weight Chart */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Scale size={18} className="text-orange-400" />
                            Weight Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="oklch(0.72 0.19 250)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="oklch(0.72 0.19 250)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270)' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270)' }} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'oklch(0.17 0.015 270)',
                                            border: '1px solid oklch(1 0 0 / 10%)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="oklch(0.72 0.19 250)"
                                        fill="url(#weightGradient)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Measurements Chart */}
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Ruler size={18} className="text-orange-400" />
                            Body Measurements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270)' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270)' }} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'oklch(0.17 0.015 270)',
                                            border: '1px solid oklch(1 0 0 / 10%)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Line type="monotone" dataKey="chest" stroke="oklch(0.75 0.18 300)" strokeWidth={2} dot={{ r: 4 }} name="Chest" />
                                    <Line type="monotone" dataKey="waist" stroke="oklch(0.8 0.15 80)" strokeWidth={2} dot={{ r: 4 }} name="Waist" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* History */}
            <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[...entries].reverse().map((entry, i) => (
                                <div key={i} className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                                    <span className="text-xs text-muted-foreground w-20">{entry.date}</span>
                                    {entry.weight && (
                                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                                            <Scale size={10} className="text-orange-400" />{entry.weight} kg
                                        </Badge>
                                    )}
                                    {entry.chest && (
                                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                                            <Maximize2 size={10} className="text-orange-400" />Chest: {entry.chest}&quot;
                                        </Badge>
                                    )}
                                    {entry.waist && (
                                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                                            <Ratio size={10} className="text-orange-400" />Waist: {entry.waist}&quot;
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
