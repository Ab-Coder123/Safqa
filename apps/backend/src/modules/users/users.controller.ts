import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  // PRIVATE: Only the authenticated user views their own full profile
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async getOwnProfile(@CurrentUser() user: any) {
    return this.usersService.getOwnProfile(user.sub);
  }

  // PRIVATE: Update own profile
  @UseGuards(JwtAuthGuard)
  @Patch('/me/profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  // SETTINGS: Change password
  @UseGuards(JwtAuthGuard)
  @Patch('me/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.sub, dto);
  }

  // SETTINGS: Soft-delete own account
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser() user: any) {
    return this.usersService.deleteAccount(user.sub);
  }

  // PUBLIC: Anyone can view a user's public profile
  @Get(':id/profile')
  async getPublicProfile(@Param('id') userId: string) {
    return this.usersService.getPublicProfile(userId);
  }
}
