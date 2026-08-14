import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserStatus, ProductStatus, ReportStatus, NotificationType } from '@safqa/types';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ─── GET SYSTEM METRICS / OVERVIEW ─────────────────────────────────────────
  async getSystemStats() {
    const [totalUsers, totalProducts, pendingReports, totalCategories] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
        this.prisma.report.count({ where: { status: ReportStatus.PENDING } }),
        this.prisma.category.count(),
      ]);

    return {
      total_users: totalUsers,
      total_products: totalProducts,
      pending_reports: pendingReports,
      total_categories: totalCategories,
    };
  }

  // ─── LIST ALL USERS FOR MODERATION ────────────────────────────────────────
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        status: true,
        created_at: true,
        _count: { select: { products: true } },
      },
    });
  }

  // ─── SUSPEND USER (Cascade Archival rule per Admin_Workflow.md) ─────────────
  async suspendUser(targetUserId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new BadRequestException('User is already suspended');
    }

    // 1. Suspend User
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status: UserStatus.SUSPENDED },
    });

    // 2. Cascade Archival Rule: Automatically archive all published products
    await this.prisma.product.updateMany({
      where: { user_id: targetUserId, status: ProductStatus.PUBLISHED },
      data: { status: ProductStatus.ARCHIVED },
    });

    // 3. Send Notification to User
    await this.notificationsService.createNotification({
      user_id: targetUserId,
      title: 'تم تعليق حسابك',
      body: `تم تعليق حسابك من قبل إدارة منصة صفقة. السبب: ${reason || 'مخالفة شروط الاستخدام'}.`,
      type: NotificationType.MODERATION,
    });

    return {
      message: 'User account suspended and active listings archived successfully',
      user: updatedUser,
    };
  }

  // ─── ACTIVATE USER ────────────────────────────────────────────────────────
  async activateUser(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status: UserStatus.ACTIVE },
    });

    return {
      message: 'User account reactivated successfully',
      user: updatedUser,
    };
  }
}
