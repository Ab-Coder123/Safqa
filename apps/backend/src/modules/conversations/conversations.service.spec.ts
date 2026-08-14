import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BadRequestException } from '@nestjs/common';
import { ProductStatus } from '@safqa/types';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      product: { findUnique: jest.fn() },
      conversation: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: { createNotification: jest.fn() } },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it('should block starting a conversation with oneself (No Self-Messaging)', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'user-1',
      status: ProductStatus.PUBLISHED,
    });

    await expect(
      service.findOrCreateConversation('user-1', { product_id: 'prod-1' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should block starting a conversation for archived products', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      user_id: 'seller-id',
      status: ProductStatus.ARCHIVED,
    });

    await expect(
      service.findOrCreateConversation('user-1', { product_id: 'prod-1' }),
    ).rejects.toThrow(BadRequestException);
  });
});
