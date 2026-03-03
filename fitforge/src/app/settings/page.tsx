'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Settings, Moon, Sun, Bell, Download, Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
    }),
};

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = theme === 'dark';

    const handleExport = () => {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('fitforge-') || key?.startsWith('efit-')) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `efit-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (confirm('Are you sure? This will reset ALL your progress, data, and settings.')) {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('fitforge-') || key?.startsWith('efit-')) keys.push(key);
            }
            keys.forEach(k => localStorage.removeItem(k));
            window.location.reload();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your eFit experience ⚙️</p>
            </motion.div>

            {/* Appearance */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isDark ? <Moon size={18} className="text-orange-400" /> : <Sun size={18} className="text-yellow-400" />}
                                <div>
                                    <p className="text-sm font-medium">Theme</p>
                                    <p className="text-xs text-muted-foreground">{isDark ? 'Dark mode' : 'Light mode'}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => mounted && setTheme(isDark ? 'light' : 'dark')}
                                className="border-zinc-800/50"
                            >
                                {mounted ? (
                                    <>
                                        {isDark ? <Sun size={14} className="mr-1" /> : <Moon size={14} className="mr-1" />}
                                        {isDark ? 'Light' : 'Dark'}
                                    </>
                                ) : (
                                    <span className="w-16">...</span>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={18} className={notifications ? 'text-orange-400' : 'text-muted-foreground'} />
                                <div>
                                    <p className="text-sm font-medium">Reminders</p>
                                    <p className="text-xs text-muted-foreground">Workout & meal reminders</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNotifications(!notifications)}
                                className={`border-zinc-800/50 ${notifications ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}`}
                            >
                                {notifications ? 'On' : 'Off'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Data */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Download size={18} className="text-emerald-400" />
                                <div>
                                    <p className="text-sm font-medium">Export Data</p>
                                    <p className="text-xs text-muted-foreground">Download all your progress as JSON</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleExport} className="border-zinc-800/50">
                                Export
                            </Button>
                        </div>
                        <Separator className="bg-zinc-900/50" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Trash2 size={18} className="text-red-400" />
                                <div>
                                    <p className="text-sm font-medium text-red-400">Reset All Data</p>
                                    <p className="text-xs text-muted-foreground">Delete all progress permanently</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleReset} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* About */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="bg-zinc-900 border border-zinc-80010 border-zinc-800/50">
                    <CardContent className="p-5 text-center">
                        <Image src="/logo.png" alt="eFit Logo" width={64} height={64} priority className="w-auto h-12 mx-auto mb-3 opacity-80" />
                        <p className="text-xs text-muted-foreground">Body Transformation System</p>
                        <Badge variant="secondary" className="mt-2 text-[10px]">v1.0.0</Badge>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
