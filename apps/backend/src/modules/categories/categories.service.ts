import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slugify } from '@safqa/utils';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const formattedSlug = slugify(dto.slug);

    // 1. Slug Uniqueness Check
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug: formattedSlug },
    });
    if (existingSlug) {
      throw new ConflictException('Category slug must be unique');
    }

    // 2. Parent Category Check if parent_id provided
    if (dto.parent_id) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: formattedSlug,
        icon_url: dto.icon_url || null,
        parent_id: dto.parent_id || null,
      },
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { parent_id: null }, // Top-level categories
      include: {
        children: true, // Subcategories
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let formattedSlug = category.slug;
    if (dto.slug && dto.slug !== category.slug) {
      formattedSlug = slugify(dto.slug);
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug: formattedSlug },
      });
      if (existingSlug) {
        throw new ConflictException('Category slug must be unique');
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name || category.name,
        slug: formattedSlug,
        icon_url: dto.icon_url !== undefined ? dto.icon_url : category.icon_url,
        parent_id: dto.parent_id !== undefined ? dto.parent_id : category.parent_id,
      },
    });

    return {
      message: 'Category updated successfully',
      category: updated,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Exception Flow: Cannot delete parent category with active subcategories
    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category containing active subcategories. Remove subcategories first',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully',
    };
  }
}
