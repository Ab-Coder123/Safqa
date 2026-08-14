import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { ProductStatus, UserRole } from '@safqa/types';
import { CONSTANTS } from '@safqa/utils';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE: Enforce daily limit per Product_Management_Workflow.md ─────────
  async create(userId: string, dto: CreateProductDto) {
    // 1. Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) {
      throw new NotFoundException('Category not found or inactive');
    }

    // 2. Daily Posting Limit — MAX 3 per day (CONSTANTS.MAX_DAILY_POSTS = 3)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await this.prisma.product.count({
      where: {
        user_id: userId,
        created_at: { gte: startOfDay },
        status: { not: ProductStatus.ARCHIVED },
      },
    });

    if (todayCount >= CONSTANTS.MAX_DAILY_POSTS) {
      throw new BadRequestException(
        `Daily posting limit of ${CONSTANTS.MAX_DAILY_POSTS} listings reached. Try again tomorrow.`,
      );
    }

    // 3. Create product with PUBLISHED status
    const product = await this.prisma.product.create({
      data: {
        user_id: userId,
        category_id: dto.category_id,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        condition: dto.condition,
        whatsapp_number: dto.whatsapp_number,
        status: ProductStatus.PUBLISHED,
      },
      include: {
        category: true,
        user: {
          select: { id: true, full_name: true, avatar_url: true },
        },
      },
    });

    return {
      message: 'Product published successfully',
      product,
    };
  }

  // ─── SEARCH/BROWSE: Product_Discovery_Workflow.md — public, paginated ───────
  async findAll(dto: SearchProductsDto) {
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 20); // Max 20 per page
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: ProductStatus.PUBLISHED, // Only PUBLISHED listings
    };

    // Full-text search on title & description
    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q, mode: 'insensitive' } },
        { description: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    if (dto.category_id) where.category_id = dto.category_id;
    if (dto.condition) where.condition = dto.condition;

    // Price range validation & normalization
    if (dto.min_price !== undefined || dto.max_price !== undefined) {
      where.price = {};
      const min = dto.min_price || 0;
      const max = dto.max_price || Number.MAX_SAFE_INTEGER;
      // Normalize if min > max
      where.price.gte = Math.min(min, max);
      where.price.lte = Math.max(min, max);
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, full_name: true, avatar_url: true } },
        },
      }),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── GET ONE: Public ─────────────────────────────────────────────────────
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { id: true, full_name: true, avatar_url: true, created_at: true } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // ─── GET MY LISTINGS: All statuses for owner ─────────────────────────────
  async findMyListings(userId: string) {
    return this.prisma.product.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  // ─── UPDATE: Ownership check — Product_Management_Workflow.md ─────────────
  async update(id: string, userId: string, userRole: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Ownership check: only owner OR SUPER_ADMIN can edit
    if (product.user_id !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('You do not have permission to edit this product');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title || product.title,
        description: dto.description || product.description,
        price: dto.price !== undefined ? dto.price : product.price,
        condition: dto.condition || product.condition,
        category_id: dto.category_id || product.category_id,
        whatsapp_number: dto.whatsapp_number || product.whatsapp_number,
      },
      include: {
        category: true,
      },
    });

    return {
      message: 'Product updated successfully',
      product: updated,
    };
  }

  // ─── MARK AS SOLD: One-way transition — Product_Lifecycle_Workflow.md ──────
  async markAsSold(id: string, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user_id !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    // One-way transition: cannot revert from SOLD to PUBLISHED
    if (product.status === ProductStatus.SOLD) {
      throw new BadRequestException('Product is already marked as sold');
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.SOLD },
    });

    return {
      message: 'Product marked as sold successfully',
    };
  }

  // ─── ARCHIVE (Soft Delete): Product_Management_Workflow.md ────────────────
  async archive(id: string, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user_id !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this product');
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
    });

    return {
      message: 'Product archived successfully',
    };
  }
}
