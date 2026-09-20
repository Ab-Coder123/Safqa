import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@safqa/types';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      product: { findUnique: jest.fn() },
      conversation: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      message: {
        findMany: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        groupBy: jest.fn(),
      },
      media: {
        findMany: jest.fn(),
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

  it('should return conversation details for a valid participant', async () => {
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 'conv-1',
      user_one_id: 'user-1',
      user_two_id: 'user-2',
      product_id: 'prod-1',
      user_one: { id: 'user-1', full_name: 'Buyer' },
      user_two: { id: 'user-2', full_name: 'Seller' },
      created_at: new Date(),
    });
    prismaMock.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      title: 'iPhone',
      price: 1000,
    });
    prismaMock.media.findMany.mockResolvedValue([
      { id: 'm-1', entity_id: 'prod-1', url: '/uploads/iphone.jpg', order: 0 },
    ]);

    const result = await service.getConversationById('conv-1', 'user-1');
    expect(result.id).toBe('conv-1');
    expect(result.other_user.full_name).toBe('Seller');
    expect(result.product?.media).toHaveLength(1);
  });

  it('should throw ForbiddenException if user is not a participant', async () => {
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 'conv-1',
      user_one_id: 'user-1',
      user_two_id: 'user-2',
    });

    await expect(
      service.getConversationById('conv-1', 'attacker-id'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if conversation does not exist', async () => {
    prismaMock.conversation.findUnique.mockResolvedValue(null);

    await expect(
      service.getConversationById('non-existent', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });
});
