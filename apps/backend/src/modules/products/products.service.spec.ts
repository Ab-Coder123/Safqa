import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductStatus, UserRole } from '@safqa/types';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      category: { findUnique: jest.fn() },
      product: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should enforce daily posting limit of 3 products', async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-1' });
    prismaMock.product.count.mockResolvedValue(3); // Already posted 3 today

    const dto = {
      title: 'New Product Title',
      description: 'Full description of product details',
      price: 1000,
      condition: 'NEW' as any,
      category_id: 'cat-1',
      whatsapp_number: '01012345678',
    };

    await expect(service.create('user-1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user edits product owned by someone else', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'owner-user',
    });

    await expect(
      service.update('prod-1', 'other-user', UserRole.USER, { title: 'Hacked Title' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow SUPER_ADMIN to edit or archive any product', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'owner-user',
      status: ProductStatus.PUBLISHED,
    });
    prismaMock.product.update.mockResolvedValue({
      id: 'prod-1',
      status: ProductStatus.ARCHIVED,
    });

    const result = await service.archive('prod-1', 'admin-id', UserRole.SUPER_ADMIN);
    expect(result.message).toContain('archived');
  });
});
