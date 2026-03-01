import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: RegisterDto) {
        const { email, password, name } = data;

        const existing = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Use Prisma transaction to ensure both User and Profile are created together
        return this.prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    name,
                },
            });

            // 2. Create Gamification Profile
            await tx.profile.create({
                data: {
                    userId: user.id,
                    level: 1,
                    currentXp: 0,
                    streak: 0,
                    primaryClass: 'Novice',
                },
            });

            // Exclude passwordHash from the returned object for security
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    async loginUser(loginDto: any) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }, // Include the gamification stats
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Exclude passwordHash from the returned profile read
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(userId: string, updateData: any) {
        return this.prisma.profile.update({
            where: { userId },
            data: {
                baseStats: updateData.baseStats,
                primaryClass: updateData.primaryClass,
                focusAreas: updateData.focusAreas,
                dietPref: updateData.dietPreference,
            },
        });
    }
}
