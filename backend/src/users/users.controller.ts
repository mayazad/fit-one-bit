import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createDto: RegisterDto) {
        return this.usersService.createUser(createDto);
    }

    @Get(':id/profile')
    async getProfile(@Param('id') id: string) {
        return this.usersService.getUserProfile(id);
    }
}
