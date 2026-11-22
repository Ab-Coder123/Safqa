import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { ProductsService } from '../../src/modules/products/products.service';
import { ConversationsService } from '../../src/modules/conversations/conversations.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { MediaService } from '../../src/modules/media/media.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MediaEntityType, ProductStatus, UserRole } from '@safqa/types';

describe('Tier 02 — Authorization, BOLA / IDOR & RBAC Controls (Security Suite)', () => {
  let productsService: ProductsService;
  let conversationsService: ConversationsService;
  let notificationsService: NotificationsService;
  let mediaService: MediaService;
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let prismaMock: any;

  const USER_A = 'user-a-owner';
  const USER_B = 'user-b-participant';
  const USER_C_ATTACKER = 'user-c-attacker';
  const SUPER_ADMIN_ID = 'admin-1';

  beforeEach(async () => {
    prismaMock = {
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      conversation: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      message: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      notification: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      media: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((ops) => Promise.all(ops)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ConversationsService,
        NotificationsService,
        MediaService,
        RolesGuard,
        Reflector,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    conversationsService = module.get<ConversationsService>(ConversationsService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    mediaService = module.get<MediaService>(MediaService);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  // ─── Scenario 2.1: Horizontal Privilege Escalation (Products & Media BOLA) ───
  describe('Scenario 2.1: Horizontal Privilege Escalation (Product & Media Ownership)', () => {
    it('should block User C from updating User A product (403 Forbidden)', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
        title: 'Original Title',
        status: ProductStatus.PUBLISHED,
      });

      await expect(
        productsService.update('prod-1', USER_C_ATTACKER, UserRole.USER, {
          title: 'Hacked Title',
        }),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.product.update).not.toHaveBeenCalled();
    });

    it('should block User C from marking User A product as SOLD (403 Forbidden)', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
        status: ProductStatus.PUBLISHED,
      });

      await expect(
        productsService.markAsSold('prod-1', USER_C_ATTACKER, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.product.update).not.toHaveBeenCalled();
    });

    it('should block User C from archiving/deleting User A product (403 Forbidden)', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
        status: ProductStatus.PUBLISHED,
      });

      await expect(
        productsService.archive('prod-1', USER_C_ATTACKER, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.product.update).not.toHaveBeenCalled();
    });

    it('should allow SUPER_ADMIN to archive User A product (Administrative Override)', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
        status: ProductStatus.PUBLISHED,
      });
      prismaMock.product.update.mockResolvedValue({ id: 'prod-1', status: ProductStatus.ARCHIVED });

      const result = await productsService.archive('prod-1', SUPER_ADMIN_ID, UserRole.SUPER_ADMIN);
      expect(result.message).toContain('archived');
      expect(prismaMock.product.update).toHaveBeenCalled();
    });

    it('should block User C from attaching media to User A product (BOLA Prevention)', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
      });

      await expect(
        mediaService.attachMedia(
          {
            entity_type: MediaEntityType.PRODUCT,
            entity_id: 'prod-1',
            url: '/uploads/hacked.jpg',
          },
          USER_C_ATTACKER,
          false,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.media.create).not.toHaveBeenCalled();
    });

    it('should block User C from reordering User A product media (BOLA Prevention)', async () => {
      prismaMock.media.findMany.mockResolvedValue([
        { id: 'media-1', entity_type: MediaEntityType.PRODUCT, entity_id: 'prod-1' },
      ]);
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: USER_A,
      });

      await expect(
        mediaService.reorderMedia(
          { items: [{ id: 'media-1', order: 2 }] },
          USER_C_ATTACKER,
          false,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.media.update).not.toHaveBeenCalled();
    });

    it('should block User C from deleting User A profile avatar media (BOLA Prevention)', async () => {
      prismaMock.media.findUnique.mockResolvedValue({
        id: 'media-avatar-a',
        entity_type: MediaEntityType.USER,
        entity_id: USER_A,
      });

      await expect(
        mediaService.deleteMedia('media-avatar-a', USER_C_ATTACKER, false),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.media.delete).not.toHaveBeenCalled();
    });
  });

  // ─── Scenario 2.2: Conversation & Private Message Eavesdropping ────────────
  describe('Scenario 2.2: Conversation & Private Message Eavesdropping', () => {
    const mockConversation = {
      id: 'conv-1',
      user_one_id: USER_A,
      user_two_id: USER_B,
      product_id: 'prod-1',
    };

    it('should block non-participant User C from reading conversation metadata', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue(mockConversation);

      await expect(
        conversationsService.getConversationById('conv-1', USER_C_ATTACKER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should block non-participant User C from reading private messages', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue(mockConversation);

      await expect(
        conversationsService.getMessages('conv-1', USER_C_ATTACKER),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.message.findMany).not.toHaveBeenCalled();
    });

    it('should block non-participant User C from injecting a message into User A & B conversation', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue(mockConversation);

      await expect(
        conversationsService.sendMessage('conv-1', USER_C_ATTACKER, {
          content: 'Injected malicious message',
        }),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.message.create).not.toHaveBeenCalled();
    });
  });

  // ─── Scenario 2.3: Vertical Privilege Escalation (Admin Route Breach) ──────
  describe('Scenario 2.3: Vertical Privilege Escalation (Admin RBAC Enforcement)', () => {
    const createRoleContext = (user?: any): ExecutionContext => {
      return {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({ user }),
        }),
      } as unknown as ExecutionContext;
    };

    it('should block standard USER from accessing SUPER_ADMIN protected routes', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.SUPER_ADMIN]);

      const ctx = createRoleContext({ sub: USER_A, role: UserRole.USER });
      expect(() => rolesGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('should block unauthenticated request on RolesGuard', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.SUPER_ADMIN]);

      const ctx = createRoleContext(undefined);
      expect(() => rolesGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('should allow SUPER_ADMIN to access SUPER_ADMIN protected routes', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.SUPER_ADMIN]);

      const ctx = createRoleContext({ sub: SUPER_ADMIN_ID, role: UserRole.SUPER_ADMIN });
      expect(rolesGuard.canActivate(ctx)).toBe(true);
    });
  });

  // ─── Scenario 2.4: Notifications & User Settings Boundary Test ─────────────
  describe('Scenario 2.4: Private Notification Stream Isolation', () => {
    it('should block User C from marking User A notification as read', async () => {
      prismaMock.notification.findUnique.mockResolvedValue({
        id: 'notif-1',
        user_id: USER_A,
        is_read: false,
      });

      await expect(
        notificationsService.markAsRead('notif-1', USER_C_ATTACKER),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.notification.update).not.toHaveBeenCalled();
    });
  });
});
