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
import { getUploadsDir } from '../../common/utils/upload-path.util';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private readonly uploadDir = getUploadsDir();

  constructor(private prisma: PrismaService) {
    // Ensure upload directory exists when base path is writable
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch {
      // Directory creation deferred until upload if base path is temporarily read-only
    }
  }

  private detectImageMimeFromMagicBytes(buffer: Buffer): string | null {
    if (!buffer || buffer.length < 12) {
      return null;
    }

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return 'image/png';
    }

    // WEBP: RIFF....WEBP
    if (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
      return 'image/webp';
    }

    return null;
  }

  async uploadFile(file: any) {
    if (!file || !file.buffer || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
      throw new BadRequestException('No file uploaded');
    }

    // 1. File Size Verification (Max 5MB — verify both declared size and actual buffer byte length)
    const actualSize = file.buffer.length;
    if (file.size > CONSTANTS.MAX_FILE_SIZE_BYTES || actualSize > CONSTANTS.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum limit of 5MB');
    }

    // 2. Strict MIME-Type Whitelist
    const mimeToExtension: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    if (!mimeToExtension[file.mimetype]) {
      throw new BadRequestException(
        'Unsupported file format. Please upload JPEG, PNG, or WEBP images',
      );
    }

    // 3. Reject dangerous client extensions (e.g. disguised .php, .exe, .svg, .html, .js)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const rawOriginalName = typeof file.originalname === 'string' ? file.originalname : '';
    const baseOriginalName = path.basename(rawOriginalName.replace(/\\/g, '/'));
    const clientExt = path.extname(baseOriginalName).toLowerCase();
    if (clientExt && !allowedExtensions.includes(clientExt)) {
      throw new BadRequestException(
        'Unsupported file extension. Only JPEG, PNG, and WEBP images are allowed',
      );
    }

    // 4. Content Validation (Magic Bytes Inspection) to block spoofed MIME types / polyglots
    const detectedMime = this.detectImageMimeFromMagicBytes(file.buffer);
    if (!detectedMime || detectedMime !== file.mimetype) {
      throw new BadRequestException(
        'Invalid image content. File binary signature does not match an allowed image format',
      );
    }

    // 5. Security: Discard client filename completely & assign cryptographically secure UUID + canonical extension
    const safeExt = mimeToExtension[detectedMime];
    const filename = `${randomUUID()}${safeExt}`;
    const resolvedUploadDir = path.resolve(this.uploadDir);
    const filePath = path.resolve(resolvedUploadDir, filename);

    if (!filePath.startsWith(resolvedUploadDir + path.sep)) {
      throw new BadRequestException('Invalid upload path');
    }

    // 6. Ensure upload directory exists and save file to disk
    if (typeof fs.promises.mkdir === 'function') {
      await fs.promises.mkdir(resolvedUploadDir, { recursive: true });
    }
    await fs.promises.writeFile(filePath, file.buffer);

    // 7. Construct public URL
    const publicUrl = `/uploads/${filename}`;

    return {
      message: 'File uploaded successfully',
      url: publicUrl,
      filename,
      size: actualSize,
      mimetype: detectedMime,
    };
  }

  async attachMedia(
    dto: AttachMediaDto,
    userId?: string,
    isSuperAdmin: boolean = false,
  ) {
    // 1. Verify target entity exists and enforce ownership
    if (dto.entity_type === MediaEntityType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.entity_id },
      });
      if (!product) {
        throw new NotFoundException('Target Product entity not found');
      }

      if (userId && !isSuperAdmin && product.user_id !== userId) {
        throw new ForbiddenException('You do not have permission to attach media to this product');
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

      if (userId && !isSuperAdmin && user.id !== userId) {
        throw new ForbiddenException('You do not have permission to attach media to another user profile');
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
    if (!isSuperAdmin && dto.items.length > 0) {
      const mediaIds = dto.items.map((item) => item.id);
      const mediaRecords = await this.prisma.media.findMany({
        where: { id: { in: mediaIds } },
      });

      if (mediaRecords.length !== mediaIds.length) {
        throw new NotFoundException('One or more media assets not found');
      }

      for (const media of mediaRecords) {
        if (media.entity_type === MediaEntityType.PRODUCT) {
          const product = await this.prisma.product.findUnique({
            where: { id: media.entity_id },
          });
          if (!product || product.user_id !== userId) {
            throw new ForbiddenException('You do not have permission to reorder this media asset');
          }
        } else if (media.entity_type === MediaEntityType.USER) {
          if (media.entity_id !== userId) {
            throw new ForbiddenException('You do not have permission to reorder this media asset');
          }
        }
      }
    }

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

    // Ownership check if attached to product or user
    if (!isSuperAdmin) {
      if (media.entity_type === MediaEntityType.PRODUCT) {
        const product = await this.prisma.product.findUnique({
          where: { id: media.entity_id },
        });
        if (product && product.user_id !== userId) {
          throw new ForbiddenException('You do not have permission to delete this media asset');
        }
      } else if (media.entity_type === MediaEntityType.USER) {
        if (media.entity_id !== userId) {
          throw new ForbiddenException('You do not have permission to delete this media asset');
        }
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
