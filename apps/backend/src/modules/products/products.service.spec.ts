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
      media: {
        createMany: jest.fn(),
        findMany: jest.fn(),
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
      media_urls: [],
    };

    await expect(service.create('user-1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should successfully create product and attach media when within daily limit', async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-1' });
    prismaMock.product.count.mockResolvedValue(1); // 1 posted today, limit is 3
    prismaMock.product.create.mockResolvedValue({
      id: 'prod-new-1',
      title: 'Valid Product Title',
      description: 'Full description of product details here',
      price: 1500,
      condition: 'NEW',
      whatsapp_number: '01012345678',
      status: ProductStatus.PUBLISHED,
    });
    prismaMock.media.createMany.mockResolvedValue({ count: 2 });
    prismaMock.media.findMany.mockResolvedValue([
      { id: 'm-1', url: 'https://example.com/1.jpg', order: 0 },
      { id: 'm-2', url: 'https://example.com/2.jpg', order: 1 },
    ]);

    const dto = {
      title: 'Valid Product Title',
      description: 'Full description of product details here',
      price: 1500,
      condition: 'NEW' as any,
      category_id: 'cat-1',
      whatsapp_number: '01012345678',
      media_urls: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
    };

    const result = await service.create('user-1', dto);
    expect(result.message).toBe('Product published successfully');
    expect(result.product.id).toBe('prod-new-1');
    expect(result.product.media).toHaveLength(2);
    expect(prismaMock.media.createMany).toHaveBeenCalled();
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

  it('should find user listings with media attachments', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 'prod-my-1', title: 'My Product 1', user_id: 'user-1' },
      { id: 'prod-my-2', title: 'My Product 2', user_id: 'user-1' },
    ]);
    prismaMock.media.findMany.mockResolvedValue([
      { id: 'm-1', entity_id: 'prod-my-1', url: 'https://example.com/p1.jpg', order: 0 },
    ]);

    const listings = await service.findMyListings('user-1');
    expect(listings).toHaveLength(2);
    expect(listings[0].media).toHaveLength(1);
    expect(listings[0].media[0].url).toBe('https://example.com/p1.jpg');
    expect(listings[1].media).toHaveLength(0);
  });
});
