import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttachMediaDto } from './dto/attach-media.dto';
import { ReorderMediaDto } from './dto/reorder-media.dto';
import { MediaEntityType, MediaType } from '@safqa/types';
import { CONSTANTS } from '@safqa/utils';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 1. File Size Verification (Max 5MB)
    if (file.size > CONSTANTS.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum limit of 5MB');
    }

    // 2. Mime-Type Validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported file format. Please upload JPEG, PNG, or WEBP images',
      );
    }

    // 3. Security: Generate random UUID filename to prevent directory traversal attacks
    const fileExt = path.extname(file.originalname).toLowerCase() || '.webp';
    const filename = `${randomUUID()}${fileExt}`;
    const filePath = path.join(this.uploadDir, filename);

    // 4. Save file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // 5. Construct public URL
    const publicUrl = `/uploads/${filename}`;

    return {
      message: 'File uploaded successfully',
      url: publicUrl,
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async attachMedia(dto: AttachMediaDto) {
    // 1. Verify target entity exists if required
    if (dto.entity_type === MediaEntityType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.entity_id },
      });
      if (!product) {
        throw new NotFoundException('Target Product entity not found');
      }

      // Check max photos constraint (Max 5 images per product)
      const existingMediaCount = await this.prisma.media.count({
        where: { entity_type: MediaEntityType.PRODUCT, entity_id: dto.entity_id },
      });
      if (existingMediaCount >= 5) {
        throw new BadRequestException('Product cannot have more than 5 images');
      }
    } else if (dto.entity_type === MediaEntityType.USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.entity_id },
      });
      if (!user) {
        throw new NotFoundException('Target User entity not found');
      }
    }

    // 2. Create Media Record
    const media = await this.prisma.media.create({
      data: {
        entity_type: dto.entity_type,
        entity_id: dto.entity_id,
        url: dto.url,
        type: dto.type || MediaType.IMAGE,
        order: dto.order || 0,
      },
    });

    return {
      message: 'Media attached successfully',
      media,
    };
  }

  async getMediaForEntity(entityType: MediaEntityType, entityId: string) {
    return this.prisma.media.findMany({
      where: { entity_type: entityType, entity_id: entityId },
      orderBy: { order: 'asc' },
    });
  }

  async reorderMedia(dto: ReorderMediaDto, userId: string, isSuperAdmin: boolean = false) {
    // Update order for each media item
    const updates = dto.items.map((item) =>
      this.prisma.media.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);

    return {
      message: 'Media reordered successfully',
    };
  }

  async deleteMedia(mediaId: string, userId: string, isSuperAdmin: boolean = false) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media asset not found');
    }

    // Ownership check if attached to product
    if (media.entity_type === MediaEntityType.PRODUCT && !isSuperAdmin) {
      const product = await this.prisma.product.findUnique({
        where: { id: media.entity_id },
      });
      if (product && product.user_id !== userId) {
        throw new ForbiddenException('You do not have permission to delete this media asset');
      }
    }

    await this.prisma.media.delete({
      where: { id: mediaId },
    });

    return {
      message: 'Media asset deleted successfully',
    };
  }
}
