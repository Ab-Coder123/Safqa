import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProductStatus, UserStatus } from '@safqa/types';
import * as bcrypt from 'bcryptjs';

// Fields that are NEVER returned in public profile responses
// (User_Profile_Workflow.md — Privacy Enforcement business rule)
const PUBLIC_PROFILE_SELECT = {
  id: true,
  full_name: true,
  avatar_url: true,
  created_at: true,
  // Omit: email, phone_number, password_hash, role, status, birth_date, gender
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ─── PUBLIC: View any user's public profile ───────────────────────────────
  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...PUBLIC_PROFILE_SELECT,
        products: {
          where: { status: ProductStatus.PUBLISHED },
          orderBy: { created_at: 'desc' },
          include: {
            category: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    // Batch fetch media for products to prevent N+1 queries
    const productIds = user.products.map((p) => p.id);
    let mediaByProduct = new Map<string, any[]>();
    if (productIds.length > 0) {
      const mediaList = await this.prisma.media.findMany({
        where: {
          entity_type: 'PRODUCT',
          entity_id: { in: productIds },
        },
        orderBy: { order: 'asc' },
      });
      mediaList.forEach((m) => {
        const existing = mediaByProduct.get(m.entity_id) || [];
        existing.push(m);
        mediaByProduct.set(m.entity_id, existing);
      });
    }

    const productsWithMedia = user.products.map((p) => ({
      ...p,
      media: mediaByProduct.get(p.id) || [],
    }));

    return {
      ...user,
      products: productsWithMedia,
    };
  }

  // ─── PRIVATE: View own full profile ───────────────────────────────────────
  async getOwnProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        gender: true,
        birth_date: true,
        avatar_url: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
        products: {
          orderBy: { created_at: 'desc' },
          include: { category: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    // Batch fetch media for own products
    const productIds = user.products.map((p) => p.id);
    let mediaByProduct = new Map<string, any[]>();
    if (productIds.length > 0) {
      const mediaList = await this.prisma.media.findMany({
        where: {
          entity_type: 'PRODUCT',
          entity_id: { in: productIds },
        },
        orderBy: { order: 'asc' },
      });
      mediaList.forEach((m) => {
        const existing = mediaByProduct.get(m.entity_id) || [];
        existing.push(m);
        mediaByProduct.set(m.entity_id, existing);
      });
    }

    const productsWithMedia = user.products.map((p) => ({
      ...p,
      media: mediaByProduct.get(p.id) || [],
    }));

    return {
      ...user,
      products: productsWithMedia,
    };
  }


  // ─── UPDATE: Update own profile ───────────────────────────────────────────
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Phone uniqueness check if changing phone
    if (dto.phone_number && dto.phone_number !== user.phone_number) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone_number: dto.phone_number },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number is already registered to another account');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        full_name: dto.full_name || user.full_name,
        phone_number: dto.phone_number || user.phone_number,
        avatar_url: dto.avatar_url !== undefined ? dto.avatar_url : user.avatar_url,
        gender: dto.gender || user.gender,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        avatar_url: true,
        gender: true,
        birth_date: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      user: updated,
    };
  }

  // ─── SETTINGS: Change password ────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.new_password !== dto.confirm_new_password) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password (User_Settings_Workflow.md — current password always required)
    const isCurrentValid = await bcrypt.compare(dto.current_password, user.password_hash);
    if (!isCurrentValid) {
      throw new ForbiddenException('Incorrect current password');
    }

    const hashedNewPassword = await bcrypt.hash(dto.new_password, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedNewPassword },
    });

    return {
      message: 'Password changed successfully. Please login again on your next session.',
    };
  }

  // ─── SETTINGS: Soft-delete account ────────────────────────────────────────
  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // User_Settings_Workflow.md — Linked Archival: Archive all products on account deletion
    await this.prisma.product.updateMany({
      where: { user_id: userId },
      data: { status: ProductStatus.ARCHIVED },
    });

    // Soft delete: set status to DELETED (never hard delete)
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED },
    });

    return {
      message: 'Your account has been deactivated. All your listings have been archived.',
    };
  }
}
