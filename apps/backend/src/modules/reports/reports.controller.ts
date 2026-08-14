import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, ReportStatus } from '@safqa/types';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // USER: Submit a report
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @CurrentUser() user: any,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.createReport(user.sub, dto);
  }

  // ADMIN: Get pending reports queue
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  async getReportsQueue(@Query('status') status?: ReportStatus) {
    return this.reportsService.getReportsQueue(status);
  }

  // ADMIN: Resolve report (take moderation action)
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveReport(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.reportsService.resolveReport(id, reason);
  }

  // ADMIN: Dismiss report
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/dismiss')
  @HttpCode(HttpStatus.OK)
  async dismissReport(@Param('id') id: string) {
    return this.reportsService.dismissReport(id);
  }
}
