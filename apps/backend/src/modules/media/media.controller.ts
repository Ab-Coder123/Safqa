import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { AttachMediaDto } from './dto/attach-media.dto';
import { ReorderMediaDto } from './dto/reorder-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MediaEntityType, UserRole } from '@safqa/types';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attach')
  @HttpCode(HttpStatus.CREATED)
  async attachMedia(@Body() dto: AttachMediaDto) {
    return this.mediaService.attachMedia(dto);
  }

  @Get(':entityType/:entityId')
  async getMediaForEntity(
    @Param('entityType') entityType: MediaEntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.mediaService.getMediaForEntity(entityType, entityId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  async reorderMedia(@Body() dto: ReorderMediaDto, @CurrentUser() user: any) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    return this.mediaService.reorderMedia(dto, user.sub, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMedia(@Param('id') mediaId: string, @CurrentUser() user: any) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    return this.mediaService.deleteMedia(mediaId, user.sub, isSuperAdmin);
  }
}
