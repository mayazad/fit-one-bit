import {
    Dumbbell, Flame, Zap, Target, Trophy, Star, Sparkles, Gem,
    Droplets, Activity, Timer, Shield, Sunrise, Mountain, Bike,
    ChevronDown, Layers, Navigation, Sun, Moon, Apple, Sword,
    Crown, TrendingUp, Heart, BarChart2, LucideIcon, Footprints,
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
    // fallback mappings for exercise-specific labels
    diamond: Gem,
    angle: Activity,
    jump: Zap,
    triangle: Activity,
    lotus: Activity,
    stretch: Activity,
    'cat-pose': Activity,
    angel: Shield,
    neck: Shield,
    chair: Shield,
    climb: Mountain,
    salad: Heart,
};

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
