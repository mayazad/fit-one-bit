import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createDto: RegisterDto): Promise<{
        name: string | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(id: string): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
            userId: string;
        } | null;
        name: string | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
