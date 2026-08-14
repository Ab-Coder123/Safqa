import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReportDto } from './dto/create-report.dto';
import {
  ReportStatus,
  ReportTargetType,
  ProductStatus,
  NotificationType,
} from '@safqa/types';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ─── SUBMIT REPORT ────────────────────────────────────────────────────────
  async createReport(reporterId: string, dto: CreateReportDto) {
    // 1. Verify Target Existence & No Self-Reporting
    if (dto.target_type === ReportTargetType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.target_id },
      });
      if (!product || product.status === ProductStatus.ARCHIVED) {
        throw new NotFoundException('Product not found or already archived');
      }
      if (product.user_id === reporterId) {
        throw new BadRequestException('You cannot report your own product listing');
      }
    } else if (dto.target_type === ReportTargetType.USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.target_id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.id === reporterId) {
        throw new BadRequestException('You cannot report yourself');
      }
    }

    // 2. Duplicate Check: Block repeat pending reports by same reporter
    const existing = await this.prisma.report.findFirst({
      where: {
        reporter_id: reporterId,
        target_type: dto.target_type,
        target_id: dto.target_id,
        status: ReportStatus.PENDING,
      },
    });

    if (existing) {
      throw new ConflictException('You have already submitted a pending report for this target');
    }

    // 3. Create Report
    const report = await this.prisma.report.create({
      data: {
        reporter_id: reporterId,
        target_type: dto.target_type,
        target_id: dto.target_id,
        reason: dto.reason,
        status: ReportStatus.PENDING,
      },
      include: {
        reporter: { select: { id: true, full_name: true, email: true } },
      },
    });

    return {
      message: 'Report submitted successfully. Our team will review it shortly.',
      report,
    };
  }

  // ─── ADMIN: Get Pending Reports Queue ─────────────────────────────────────
  async getReportsQueue(status?: ReportStatus) {
    const where = status ? { status } : {};
    const reports = await this.prisma.report.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        reporter: { select: { id: true, full_name: true, email: true } },
      },
    });

    return reports;
  }

  // ─── ADMIN: Resolve Report ────────────────────────────────────────────────
  async resolveReport(reportId: string, actionReason?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // If target is PRODUCT, archive the product and notify owner
    if (report.target_type === ReportTargetType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: report.target_id },
      });

      if (product) {
        await this.prisma.product.update({
          where: { id: report.target_id },
          data: { status: ProductStatus.ARCHIVED },
        });

        // Moderation Notification to Product Owner
        await this.notificationsService.createNotification({
          user_id: product.user_id,
          title: 'تم حذف إعلانك بسبب إبلاغ مخالفة',
          body: `تم أرشفة إعلانك "${product.title}" بناءً على مراجعة الإدارة: ${actionReason || report.reason}`,
          type: NotificationType.MODERATION,
        });
      }
    }

    // Update Report Status -> RESOLVED
    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.RESOLVED },
    });

    return {
      message: 'Report resolved and moderation action applied successfully',
      report: updated,
    };
  }

  // ─── ADMIN: Dismiss Report ────────────────────────────────────────────────
  async dismissReport(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.DISMISSED },
    });

    return {
      message: 'Report dismissed',
      report: updated,
    };
  }
}
