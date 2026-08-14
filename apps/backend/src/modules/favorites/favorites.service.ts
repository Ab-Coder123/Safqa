import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus } from '@safqa/types';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // ─── TOGGLE FAVORITE ──────────────────────────────────────────────────────
  // Rules from Favorites_Workflow.md:
  // 1. Authenticated user only
  // 2. Cannot favorite own product (No Self-Favoriting rule)
  // 3. Product must exist and be PUBLISHED
  // 4. Cascade toggle (create if absent, delete if present)
  async toggleFavorite(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status === ProductStatus.ARCHIVED) {
      throw new NotFoundException('Product not found or no longer available');
    }

    // Business Rule: No Self-Favoriting
    if (product.user_id === userId) {
      throw new BadRequestException('You cannot favorite your own product listing');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await this.prisma.favorite.delete({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });
      return {
        message: 'Product removed from favorites',
        is_favorited: false,
      };
    } else {
      // Add to favorites
      await this.prisma.favorite.create({
        data: {
          user_id: userId,
          product_id: productId,
        },
      });
      return {
        message: 'Product added to favorites',
        is_favorited: true,
      };
    }
  }

  // ─── GET USER FAVORITES ────────────────────────────────────────────────────
  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        user_id: userId,
        product: {
          status: { not: ProductStatus.ARCHIVED },
        },
      },
      orderBy: { created_at: 'desc' },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            user: { select: { id: true, full_name: true, avatar_url: true } },
          },
        },
      },
    });

    return favorites.map((f) => ({
      ...f.product,
      favorited_at: f.created_at,
    }));
  }

  // ─── CHECK FAVORITE STATUS FOR ONE PRODUCT ──────────────────────────────
  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });
    return !!favorite;
  }
}
