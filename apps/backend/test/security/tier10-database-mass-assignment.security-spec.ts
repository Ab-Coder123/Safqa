import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UsersService } from '../../src/modules/users/users.service';
import { ProductsService } from '../../src/modules/products/products.service';
import { AdminService } from '../../src/modules/admin/admin.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import {
  PrismaService,
  validateDatabaseUrlSecurity,
} from '../../src/prisma/prisma.service';
import { UpdateProfileDto } from '../../src/modules/users/dto/update-profile.dto';
import { ProductStatus, UserGender, UserRole, UserStatus } from '@safqa/types';

describe('Tier 10 — Database Layer, Prisma Security & Mass Assignment Defense (Security Suite)', () => {
  let usersService: UsersService;
  let productsService: ProductsService;
  let adminService: AdminService;
  let prismaMock: any;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn((ops: Promise<any>[]) => Promise.all(ops)),
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ProductsService,
        AdminService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: NotificationsService,
          useValue: { createNotification: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    productsService = module.get<ProductsService>(ProductsService);
    adminService = module.get<AdminService>(AdminService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });
  });

  // ─── Scenario 10.1: Mass Assignment & Privilege Tampering ──────────────────
  describe('Scenario 10.1: Mass Assignment & Privilege Escalation Defense', () => {
    it('should reject role, status, and password_hash injection via UpdateProfileDto', async () => {
      const payloads = [
        { full_name: 'Attacker', role: UserRole.SUPER_ADMIN },
        { full_name: 'Attacker', status: UserStatus.ACTIVE },
        { full_name: 'Attacker', password_hash: '$2b$10$hacked' },
        { full_name: 'Attacker', email: 'admin@safqa.com' },
      ];

      for (const payload of payloads) {
        await expect(
          validationPipe.transform(payload, {
            type: 'body',
            metatype: UpdateProfileDto,
          }),
        ).rejects.toThrow(BadRequestException);
      }
    });

    it('should never pass role, status, or password_hash to Prisma even if extra properties reach UsersService.updateProfile', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        full_name: 'Normal User',
        phone_number: '01012345678',
        avatar_url: null,
        gender: UserGender.MALE,
        role: UserRole.USER,
      });
      prismaMock.user.update.mockResolvedValue({
        id: 'user-1',
        full_name: 'Updated Name',
        role: UserRole.USER,
      });

      await usersService.updateProfile('user-1', {
        full_name: 'Updated Name',
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        password_hash: 'overwritten',
      } as any);

      const updateData = prismaMock.user.update.mock.calls[0][0].data;
      expect(updateData.role).toBeUndefined();
      expect(updateData.status).toBeUndefined();
      expect(updateData.password_hash).toBeUndefined();
      expect(updateData.email).toBeUndefined();
    });

    it('should never allow user_id or status mass-assignment inside ProductsService.update', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        user_id: 'owner-1',
        title: 'Original',
        description: 'Original desc',
        price: 500,
        condition: 'USED',
        category_id: 'cat-1',
        whatsapp_number: '01012345678',
        status: ProductStatus.PUBLISHED,
      });
      prismaMock.product.update.mockResolvedValue({ id: 'prod-1' });

      await productsService.update('prod-1', 'owner-1', UserRole.USER, {
        title: 'Updated Title',
        user_id: 'other-user',
        status: ProductStatus.SOLD,
      } as any);

      const updateData = prismaMock.product.update.mock.calls[0][0].data;
      expect(updateData.user_id).toBeUndefined();
      expect(updateData.status).toBeUndefined();
    });
  });

  // ─── Scenario 10.2: Prisma Connection Security & SSL ───────────────────────
  describe('Scenario 10.2: Prisma Connection TLS/SSL Enforcement & Zero Raw SQL', () => {
    it('should reject external production PostgreSQL URLs missing sslmode=require', () => {
      const insecureCloudUrl =
        'postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/safqa';
      const result = validateDatabaseUrlSecurity(insecureCloudUrl, 'production');
      expect(result.secure).toBe(false);
      expect(result.reason).toContain('sslmode=require');
    });

    it('should accept cloud production PostgreSQL URLs enforcing sslmode=require', () => {
      const secureCloudUrl =
        'postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/safqa?sslmode=require';
      const result = validateDatabaseUrlSecurity(secureCloudUrl, 'production');
      expect(result.secure).toBe(true);
    });

    it('should allow localhost in development and private railway.internal mesh', () => {
      expect(
        validateDatabaseUrlSecurity(
          'postgresql://postgres:postgres@localhost:5432/safqa',
          'development',
        ).secure,
      ).toBe(true);

      expect(
        validateDatabaseUrlSecurity(
          'postgresql://postgres:pass@postgres.railway.internal:5432/railway',
          'production',
        ).secure,
      ).toBe(true);
    });

    it('should contain zero unsafe raw SQL invocations ($queryRawUnsafe / $executeRawUnsafe) in backend src/', () => {
      const srcDir = path.resolve(__dirname, '../../src');
      const collectTsFiles = (dir: string): string[] => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        return entries.flatMap((entry) => {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) return collectTsFiles(full);
          return entry.name.endsWith('.ts') ? [full] : [];
        });
      };

      const files = collectTsFiles(srcDir);
      expect(files.length).toBeGreaterThan(10);

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        expect(content).not.toContain('$queryRawUnsafe');
        expect(content).not.toContain('$executeRawUnsafe');
      }
    });
  });

  // ─── Scenario 10.3: Database Cascade & Orphaned Records Prevention ─────────
  describe('Scenario 10.3: Atomic Archival & Cascade Integrity', () => {
    it('should atomically archive user products and soft-delete account inside a Prisma $transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-del',
        status: UserStatus.ACTIVE,
      });
      prismaMock.product.updateMany.mockResolvedValue({ count: 3 });
      prismaMock.user.update.mockResolvedValue({
        id: 'user-del',
        status: UserStatus.DELETED,
      });

      const res = await usersService.deleteAccount('user-del');

      expect(res.message).toContain('deactivated');
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.product.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'user-del' },
        data: { status: ProductStatus.ARCHIVED },
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-del' },
        data: { status: UserStatus.DELETED },
      });
    });

    it('should atomically suspend user and archive published products inside a Prisma $transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-susp',
        status: UserStatus.ACTIVE,
      });
      prismaMock.user.update.mockResolvedValue({
        id: 'user-susp',
        status: UserStatus.SUSPENDED,
      });
      prismaMock.product.updateMany.mockResolvedValue({ count: 2 });

      await adminService.suspendUser('user-susp', 'Policy violation');

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.product.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'user-susp', status: ProductStatus.PUBLISHED },
        data: { status: ProductStatus.ARCHIVED },
      });
    });

    it('should define onDelete: Cascade constraints in prisma/schema.prisma to prevent orphaned rows', () => {
      const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      expect(schema).toContain('onDelete: Cascade');
      // Verify cascade exists on core child models
      const cascadeMatches = schema.match(/onDelete:\s*Cascade/g) || [];
      expect(cascadeMatches.length).toBeGreaterThanOrEqual(6);
    });
  });
});
