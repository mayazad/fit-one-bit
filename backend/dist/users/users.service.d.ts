import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: RegisterDto): Promise<{
        name: string | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserProfile(userId: string): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            level: number;
            currentXp: number;
            streak: number;
            baseStats: import("@prisma/client/runtime/library").JsonValue | null;
            primaryClass: string | null;
            focusAreas: import("@prisma/client/runtime/library").JsonValue | null;
            dietPref: string | null;
            waterGlasses: number;
            waterGoal: number;
            sleepHours: number;
        } | null;
        name: string | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        level: number;
        currentXp: number;
        streak: number;
        baseStats: import("@prisma/client/runtime/library").JsonValue | null;
        primaryClass: string | null;
        focusAreas: import("@prisma/client/runtime/library").JsonValue | null;
        dietPref: string | null;
        waterGlasses: number;
        waterGoal: number;
        sleepHours: number;
    }>;
}
