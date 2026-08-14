import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Get recipient's notifications + unread count
  @Get()
  async getUserNotifications(@CurrentUser() user: any) {
    return this.notificationsService.getUserNotifications(user.sub);
  }

  // Mark all notifications as read
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.sub);
  }

  // Mark single notification as read
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.sub);
  }
}
