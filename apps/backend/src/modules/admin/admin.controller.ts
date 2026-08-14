import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@safqa/types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get Admin Dashboard Overview System Metrics
  @Get('stats')
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }

  // Get User List for Moderation
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // Suspend User + Cascade Archive Listings
  @Patch('users/:id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendUser(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.suspendUser(id, reason);
  }

  // Activate User
  @Patch('users/:id/activate')
  @HttpCode(HttpStatus.OK)
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }
}
