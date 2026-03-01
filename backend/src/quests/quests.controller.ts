import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
    constructor(private readonly questsService: QuestsService) { }

    @Post(':id/complete')
    async completeQuest(
        @Param('id') id: string,
        @Body('userId') userId: string,
        @Body('xpReward') xpReward?: string
    ) {
        const reward = xpReward ? parseInt(xpReward, 10) : 15;
        return this.questsService.completeQuest(userId, id, reward);
    }
}
