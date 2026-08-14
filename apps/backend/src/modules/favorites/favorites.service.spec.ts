import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@safqa/types';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      product: { findUnique: jest.fn() },
      favorite: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should prevent self-favoriting own product (No Self-Favoriting rule)', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'user-1', // Same user
      status: ProductStatus.PUBLISHED,
    });

    await expect(service.toggleFavorite('user-1', 'prod-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should toggle favorite on valid product owned by another user', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'other-user',
      status: ProductStatus.PUBLISHED,
    });
    prismaMock.favorite.findUnique.mockResolvedValue(null); // Not favorited yet

    const result = await service.toggleFavorite('user-1', 'prod-1');
    expect(result.is_favorited).toBe(true);
    expect(prismaMock.favorite.create).toHaveBeenCalled();
  });
});
