import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createDto: RegisterDto) {
        return this.usersService.createUser(createDto);
    }

    // Alias for 'register' — frontend uses /users/signup
    @Post('signup')
    async signup(@Body() createDto: RegisterDto) {
        return this.usersService.createUser(createDto);
    }

    @Post('login')
    async login(@Body() loginDto: any) {
        return this.usersService.loginUser(loginDto);
    }

    @Get(':id/profile')
    async getProfile(@Param('id') id: string) {
        return this.usersService.getUserProfile(id);
    }

    @Patch(':id/profile')
    async updateProfile(@Param('id') id: string, @Body() updateData: any) {
        return this.usersService.updateProfile(id, updateData);
    }
}
