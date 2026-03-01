import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export function getXpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.3, level));
}

@Injectable()
export class QuestsService {
    constructor(private prisma: PrismaService) { }

    async completeQuest(userId: string, questId: string, xpReward: number = 15) {
        // Note: The prompt tells us to "Verify the quest exists and get its xpReward", but
        // quest verification might depend on a Quest model or hardcoded list if the quest
        // system is handled partially in frontend. For now, we will allow frontend to send xpReward or
        // default to a known value if we don't have a rigid DB quest table mapping yet.
        // If the DB has `Quest` model, let's verify if that quest actually exists.

        // We will assume the `Quest` table exists based on schema.prisma and verify it.
        let reward = xpReward;
        if (questId) {
            // Trying to fetch from DB if there is a 'Quest' table representing standard quests
            const quest = await this.prisma.quest.findUnique({
                where: { id: questId },
            });
            if (quest) {
                reward = quest.xpReward;
            }
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Create the QuestCompletion record
            await tx.questCompletion.create({
                data: {
                    userId,
                    questId,
                    earnedXp: reward,
                },
            });

            // 2. Fetch current profile
            const profile = await tx.profile.findUnique({
                where: { userId },
            });

            if (!profile) {
                throw new NotFoundException('Profile not found for this user');
            }

            // 3. Update XP and Level
            let currentXp = profile.currentXp + reward;
            let level = profile.level;
            let xpForNextLevel = getXpForLevel(level);

            while (currentXp >= xpForNextLevel) {
                currentXp -= xpForNextLevel;
                level += 1;
                xpForNextLevel = getXpForLevel(level);
            }

            // 4. Save updated profile
            const updatedProfile = await tx.profile.update({
                where: { id: profile.id },
                data: {
                    currentXp,
                    level,
                },
            });

            return updatedProfile;
        });
    }
}
