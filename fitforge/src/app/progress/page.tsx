'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Plus, Scale, Ruler, Weight, Maximize2, Ratio, Image as ImageIcon, Download, Target, CalendarDays, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgressStore } from '@/stores/progressStore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
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
    const [newPhoto, setNewPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [chartTimeframe, setChartTimeframe] = useState<'1M' | '3M' | 'ALL'>('ALL');
    const TARGET_WEIGHT = 50.0; // Example target weight

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = () => {
        if (!newWeight && !newPhoto) return;
        addEntry({
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(newWeight) || undefined,
            chest: parseFloat(newChest) || undefined,
            waist: parseFloat(newWaist) || undefined,
            photo: newPhoto || undefined,
        });
        setNewWeight('');
        setNewChest('');
        setNewWaist('');
        setNewPhoto(null);
        setShowForm(false);
    };

    const weightChange = entries.length >= 2
        ? (entries[entries.length - 1].weight ?? 0) - (entries[0].weight ?? 0)
        : 0;

    let filteredEntries = [...entries];
    if (chartTimeframe === '1M') {
        filteredEntries = entries.slice(-30);
    } else if (chartTimeframe === '3M') {
        filteredEntries = entries.slice(-90);
    }

    const chartData = filteredEntries.map(e => ({
        date: e.date.slice(5),
        weight: e.weight,
        chest: e.chest,
        waist: e.waist,
    }));

    const photosWithDates = entries.filter(e => e.photo).map(e => ({ date: e.date, photo: e.photo! }));
    const oldestPhoto = photosWithDates[0];
    const newestPhoto = photosWithDates[photosWithDates.length - 1];

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
                        {showForm ? <Plus className="rotate-45 transition-transform" /> : <Plus size={16} className="mr-1" />}
                        {showForm ? 'Cancel' : 'Log Entry'}
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

                            {/* Photo Upload Area */}
                            <div className="mt-4">
                                <label className="text-xs text-muted-foreground mb-1 block">Progress Photo</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handlePhotoUpload}
                                    />
                                    <Button
                                        variant="outline"
                                        className="bg-zinc-900/50 border-zinc-800/50 text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={16} className="mr-2" />
                                        Upload Photo
                                    </Button>
                                    {newPhoto && (
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border border-zinc-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={newPhoto} alt="Upload Preview" className="object-cover w-full h-full" />
                                            <button
                                                className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl-md text-white hover:text-red-400"
                                                onClick={() => setNewPhoto(null)}
                                            >
                                                <Plus className="rotate-45" size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button onClick={handleAdd} className="mt-4 w-full sm:w-auto" size="sm">
                                Save Entry
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1">
                    <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                        <TrendingUp size={14} className="mr-1" /> Overview Data
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                        <ImageIcon size={14} className="mr-1" /> Transformation Gallery
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
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
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Scale size={18} className="text-orange-400" />
                                    Weight Trend
                                </CardTitle>
                                <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/50">
                                    {(['1M', '3M', 'ALL'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setChartTimeframe(t)}
                                            className={`text-[10px] px-2 py-1 rounded transition-colors ${chartTimeframe === t ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-muted-foreground hover:text-zinc-300'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
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
                                            <ReferenceLine y={TARGET_WEIGHT} stroke="oklch(0.577 0.245 27.325)" strokeDasharray="3 3">
                                            </ReferenceLine>
                                            <Area
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="oklch(0.72 0.19 250)"
                                                fill="url(#weightGradient)"
                                                strokeWidth={2}
                                                isAnimationActive={true}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Measurements & History */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                            <Card className="glass-card border-zinc-800/50 h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Ruler size={18} className="text-orange-400" />
                                        Body Measurements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        {/* Simple Body Illustration via CSS/SVG */}
                                        <div className="flex-shrink-0 w-20 h-40 hidden sm:flex justify-center border-r border-zinc-800/50 pr-4 relative">
                                            <svg viewBox="0 0 100 200" className="opacity-40 stroke-current text-orange-400">
                                                {/* Head */}
                                                <circle cx="50" cy="30" r="15" fill="none" strokeWidth="4" />
                                                {/* Chest/Shoulders line */}
                                                <path d="M 30 65 Q 50 65 70 65" fill="none" strokeWidth="4" className="text-emerald-400" />
                                                <text x="75" y="68" fontSize="12" fill="currentColor" stroke="none" className="text-emerald-400">Chest</text>
                                                {/* Torso/Body */}
                                                <path d="M 50 45 L 50 110" fill="none" strokeWidth="4" />
                                                {/* Arms */}
                                                <path d="M 30 65 C 20 80, 20 100, 30 115" fill="none" strokeWidth="4" />
                                                <path d="M 70 65 C 80 80, 80 100, 70 115" fill="none" strokeWidth="4" />
                                                {/* Waist line */}
                                                <path d="M 35 105 Q 50 105 65 105" fill="none" strokeWidth="4" className="text-blue-400" />
                                                <text x="70" y="108" fontSize="12" fill="currentColor" stroke="none" className="text-blue-400">Waist</text>
                                                {/* Legs */}
                                                <path d="M 50 110 C 40 140, 30 170, 30 200" fill="none" strokeWidth="4" />
                                                <path d="M 50 110 C 60 140, 70 170, 70 200" fill="none" strokeWidth="4" />
                                            </svg>
                                        </div>
                                        <div className="h-64 flex-1">
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
                                                    <Line type="monotone" dataKey="chest" stroke="oklch(0.75 0.18 300)" strokeWidth={2} dot={{ r: 4 }} name="Chest" isAnimationActive={true} />
                                                    <Line type="monotone" dataKey="waist" stroke="oklch(0.8 0.15 80)" strokeWidth={2} dot={{ r: 4 }} name="Waist" isAnimationActive={true} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* History */}
                        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
                            <Card className="glass-card border-zinc-800/50 h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2">
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
                                                {entry.photo && (
                                                    <Badge variant="secondary" className="text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                        <ImageIcon size={10} /> Photo attached
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="gallery">
                    <Card className="glass-card border-zinc-800/50">
                        <CardHeader className="pb-2 border-b border-zinc-800/50">
                            <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                                <ImageIcon size={18} />
                                Transformation Gallery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {photosWithDates.length < 2 ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4">
                                        <Camera className="text-muted-foreground w-8 h-8 opacity-50" />
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-300">Not enough photos yet</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Upload at least two progress photos in the Log Entry form to see your before-and-after comparison here.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-center mb-6">
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-xs">
                                            {photosWithDates.length} Photos Captured
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* BEFORE */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-[10px] border-zinc-700">BEFORE ({oldestPhoto.date})</Badge>
                                            </div>
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-zinc-800/80 bg-zinc-900 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={oldestPhoto.photo} alt="Before Progress" className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* AFTER */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-none">CURRENT ({newestPhoto.date})</Badge>
                                            </div>
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-zinc-900 flex items-center justify-center group relative cursor-pointer">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={newestPhoto.photo} alt="After Progress" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <span className="text-xs font-semibold text-white drop-shadow-md">You're making progress! 🔥</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
