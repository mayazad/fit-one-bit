import {
    Dumbbell, Flame, Zap, Target, Trophy, Star, Sparkles, Gem,
    Droplets, Activity, Timer, Shield, Sunrise, Mountain, Bike,
    ChevronDown, Layers, Navigation, Sun, Moon, Apple, Sword,
    Crown, TrendingUp, Heart, BarChart2, LucideIcon, Footprints,
    HeartPulse, Move,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    dumbbell: Dumbbell,
    weight: Dumbbell,
    flame: Flame,
    zap: Zap,
    target: Target,
    trophy: Trophy,
    star: Star,
    sparkles: Sparkles,
    gem: Gem,
    droplets: Droplets,
    activity: Activity,
    timer: Timer,
    shield: Shield,
    sunrise: Sunrise,
    mountain: Mountain,
    bike: Bike,
    'chevron-down': ChevronDown,
    layers: Layers,
    run: Navigation,
    sun: Sun,
    moon: Moon,
    apple: Apple,
    sword: Sword,
    crown: Crown,
    trending: TrendingUp,
    heart: Heart,
    chart: BarChart2,
    footprints: Footprints,
    heartpulse: HeartPulse,
    move: Move,
    // fallback mappings for exercise-specific labels
    diamond: Activity,
    angle: Activity,
    jump: Zap,
    triangle: Activity,
    lotus: Move,
    stretch: Move,
    'cat-pose': Move,
    angel: Move,
    neck: Move,
    chair: Shield,
    climb: Mountain,
    salad: Heart,
};

/**
 * Returns a Lucide icon component + tailwind color class based on exercise category.
 * This drives the fitness-focused icon semantic in the workout list.
 */
export function getCategoryIconMeta(category: string, iconKey: string): {
    Icon: LucideIcon;
    colorClass: string;
} {
    switch (category) {
        case 'legs':
            return { Icon: Footprints, colorClass: 'text-blue-400' };
        case 'core':
            return { Icon: Activity, colorClass: 'text-orange-400' };
        case 'full-body':
            return { Icon: HeartPulse, colorClass: 'text-orange-400' };
        case 'flexibility':
            return { Icon: Move, colorClass: 'text-orange-400' };
        case 'posture':
            return { Icon: Move, colorClass: 'text-orange-400' };
        case 'performance':
            return { Icon: Zap, colorClass: 'text-yellow-400' };
        case 'chest':
        default:
            return { Icon: iconMap[iconKey] ?? Dumbbell, colorClass: 'text-orange-400' };
    }
}

interface ExerciseIconProps {
    icon: string;
    size?: number;
    className?: string;
}

export function ExerciseIcon({ icon, size = 18, className = '' }: ExerciseIconProps) {
    const IconComponent = iconMap[icon] ?? Dumbbell;
    return <IconComponent size={size} className={className} />;
}

export function getIconComponent(icon: string): LucideIcon {
    return iconMap[icon] ?? Dumbbell;
}
