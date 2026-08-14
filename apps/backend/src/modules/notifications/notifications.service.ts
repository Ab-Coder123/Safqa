import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CONSTANTS } from '@safqa/utils';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ─── INTERNAL SERVICE: Create Notification ────────────────────────────────
  async createNotification(dto: CreateNotificationDto) {
    // Check recipient user status (skip if deleted or suspended per workflow)
    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
      select: { status: true },
    });

    if (!recipient || recipient.status !== 'ACTIVE') {
      return null;
    }

    return this.prisma.notification.create({
      data: {
        user_id: dto.user_id,
        title: dto.title,
        body: dto.body,
        type: dto.type,
      },
    });
  }

  // ─── GET USER NOTIFICATIONS ───────────────────────────────────────────────
  async getUserNotifications(userId: string) {
    // Auto-cleanup expired notifications before returning (3 days rule)
    await this.cleanupExpiredNotifications();

    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.notification.count({
        where: { user_id: userId, is_read: false },
      }),
    ]);

    return {
      notifications,
      unread_count: unreadCount,
    };
  }

  // ─── MARK SINGLE NOTIFICATION AS READ ─────────────────────────────────────
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenException('You cannot modify this notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  // ─── MARK ALL AS READ ─────────────────────────────────────────────────────
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });

    return { message: 'All notifications marked as read' };
  }

  // ─── AUTO-EXPIRY CLEANUP (3-day cleanup per Notification_Workflow.md) ──────
  async cleanupExpiredNotifications() {
    const expiryDays = CONSTANTS.NOTIFICATION_EXPIRY_DAYS || 3;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - expiryDays);

    const deleted = await this.prisma.notification.deleteMany({
      where: {
        created_at: { lt: thresholdDate },
      },
    });

    return deleted.count;
  }
}
