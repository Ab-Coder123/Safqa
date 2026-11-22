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
import { Throttle } from '../../common/decorators/throttle.decorator';
import { MediaEntityType, UserRole } from '@safqa/types';
import { CONSTANTS } from '@safqa/utils';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Throttle({ limit: 20, ttl: 60 })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: CONSTANTS.MAX_FILE_SIZE_BYTES,
        files: 1,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attach')
  @HttpCode(HttpStatus.CREATED)
  async attachMedia(@Body() dto: AttachMediaDto, @CurrentUser() user: any) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    return this.mediaService.attachMedia(dto, user.sub, isSuperAdmin);
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
