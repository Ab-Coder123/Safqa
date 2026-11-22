import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ProductsService } from '../../src/modules/products/products.service';
import { ConversationsService } from '../../src/modules/conversations/conversations.service';
import { FavoritesService } from '../../src/modules/favorites/favorites.service';
import { ReportsService } from '../../src/modules/reports/reports.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateProductDto } from '../../src/modules/products/dto/create-product.dto';
import {
  ProductCondition,
  ProductStatus,
  ReportTargetType,
  UserRole,
} from '@safqa/types';

describe('Tier 09 — Business Logic Abuse, Race Conditions & State Integrity (Security Suite)', () => {
  let productsService: ProductsService;
  let conversationsService: ConversationsService;
  let favoritesService: FavoritesService;
  let reportsService: ReportsService;
  let prismaMock: any;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    prismaMock = {
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
      favorite: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      conversation: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      report: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      media: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ConversationsService,
        FavoritesService,
        ReportsService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: NotificationsService,
          useValue: { createNotification: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    conversationsService = module.get<ConversationsService>(ConversationsService);
    favoritesService = module.get<FavoritesService>(FavoritesService);
    reportsService = module.get<ReportsService>(ReportsService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });
  });

  // ─── Scenario 9.1: Self-Interaction Restrictions ───────────────────────────
  describe('Scenario 9.1: Self-Interaction Restrictions', () => {
    it('should block user from starting a chat conversation with themselves', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: 'user-self',
        title: 'My Item',
        status: ProductStatus.PUBLISHED,
      });

      await expect(
        conversationsService.findOrCreateConversation('user-self', {
          product_id: 'prod-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block user from favoriting their own listing', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: 'user-self',
        status: ProductStatus.PUBLISHED,
      });

      await expect(
        favoritesService.toggleFavorite('user-self', 'prod-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block user from reporting their own listing or themselves', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: 'user-self',
        status: ProductStatus.PUBLISHED,
      });
      await expect(
        reportsService.createReport('user-self', {
          target_type: ReportTargetType.PRODUCT,
          target_id: 'prod-1',
          reason: 'Self report test',
        }),
      ).rejects.toThrow(BadRequestException);

      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-self' });
      await expect(
        reportsService.createReport('user-self', {
          target_type: ReportTargetType.USER,
          target_id: 'user-self',
          reason: 'Self report user',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Scenario 9.2: Illegal State Transitions ───────────────────────────────
  describe('Scenario 9.2: Illegal State Transitions', () => {
    it('should block editing a SOLD or ARCHIVED product', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-sold',
        user_id: 'owner-1',
        status: ProductStatus.SOLD,
      });

      await expect(
        productsService.update('prod-sold', 'owner-1', UserRole.USER, {
          price: 999,
        }),
      ).rejects.toThrow(BadRequestException);

      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-archived',
        user_id: 'owner-1',
        status: ProductStatus.ARCHIVED,
      });

      await expect(
        productsService.update('prod-archived', 'owner-1', UserRole.USER, {
          title: 'Resurrected Item',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block marking an ARCHIVED product as SOLD', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-archived',
        user_id: 'owner-1',
        status: ProductStatus.ARCHIVED,
      });

      await expect(
        productsService.markAsSold('prod-archived', 'owner-1', UserRole.USER),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block starting a conversation on SOLD or ARCHIVED products', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-sold',
        user_id: 'seller-1',
        status: ProductStatus.SOLD,
      });

      await expect(
        conversationsService.findOrCreateConversation('buyer-1', {
          product_id: 'prod-sold',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block adding a new favorite on a SOLD product', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-sold',
        user_id: 'seller-1',
        status: ProductStatus.SOLD,
      });
      prismaMock.favorite.findUnique.mockResolvedValue(null);

      await expect(
        favoritesService.toggleFavorite('buyer-1', 'prod-sold'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Scenario 9.3: Concurrent Action / Race Condition Testing ──────────────
  describe('Scenario 9.3: Concurrent Action / Race Condition Resilience', () => {
    it('should allow exactly 1 of 10 parallel markAsSold calls to succeed via atomic conditional update', async () => {
      let currentStatus = ProductStatus.PUBLISHED;

      prismaMock.product.findUnique.mockImplementation(async () => ({
        id: 'prod-race',
        user_id: 'owner-1',
        status: currentStatus,
      }));

      // Atomic DB conditional update simulation
      prismaMock.product.updateMany.mockImplementation(async (args: any) => {
        if (args.where.status === currentStatus) {
          currentStatus = args.data.status;
          return { count: 1 };
        }
        return { count: 0 };
      });

      const results = await Promise.allSettled(
        Array.from({ length: 10 }, () =>
          productsService.markAsSold('prod-race', 'owner-1', UserRole.USER),
        ),
      );

      const fulfilled = results.filter((r) => r.status === 'fulfilled');
      const rejected = results.filter((r) => r.status === 'rejected');

      expect(fulfilled).toHaveLength(1);
      expect(rejected).toHaveLength(9);
      expect(currentStatus).toBe(ProductStatus.SOLD);
    });

    it('should handle 10 parallel toggleFavorite inserts idempotently without unhandled P2002 crashes', async () => {
      let existsInDb = false;

      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-fav-race',
        user_id: 'seller-1',
        status: ProductStatus.PUBLISHED,
      });
      // All 10 concurrent reads observe null before first insert commits
      prismaMock.favorite.findUnique.mockResolvedValue(null);
      prismaMock.favorite.create.mockImplementation(async () => {
        if (existsInDb) {
          const err: any = new Error('Unique constraint failed');
          err.code = 'P2002';
          throw err;
        }
        existsInDb = true;
        return { user_id: 'buyer-1', product_id: 'prod-fav-race' };
      });

      const results = await Promise.all(
        Array.from({ length: 10 }, () =>
          favoritesService.toggleFavorite('buyer-1', 'prod-fav-race'),
        ),
      );

      expect(results).toHaveLength(10);
      expect(results.every((r) => r.is_favorited === true)).toBe(true);
    });
  });

  // ─── Scenario 9.4: Price & Numeric Manipulation ────────────────────────────
  describe('Scenario 9.4: Price & Numeric Manipulation Defense', () => {
    it('should reject NaN, Infinity, negative, and string prices', async () => {
      const badPrices: any[] = [-50, Number.NaN, Number.POSITIVE_INFINITY, '1000abc'];

      for (const badPrice of badPrices) {
        await expect(
          validationPipe.transform(
            {
              title: 'Valid Laptop Listing',
              description: 'Clean laptop in excellent working condition with charger',
              price: badPrice,
              condition: ProductCondition.USED,
              category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
              whatsapp_number: '01012345678',
            },
            { type: 'body', metatype: CreateProductDto },
          ),
        ).rejects.toThrow(BadRequestException);
      }

      // Service-level guard against NaN in search filter
      await expect(
        productsService.findAll({ min_price: Number.NaN, max_price: 5000 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
