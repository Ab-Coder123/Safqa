import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { ProductsService } from '../../src/modules/products/products.service';
import { AdminService } from '../../src/modules/admin/admin.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ProductStatus, UserRole, UserStatus } from '@safqa/types';

describe('Tier 07 — Data Exposure, PII Protection & Error Response Scrubbing (Security Suite)', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let productsService: ProductsService;
  let adminService: AdminService;
  let exceptionFilter: HttpExceptionFilter;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      media: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      report: {
        count: jest.fn(),
      },
      category: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ProductsService,
        AdminService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: NotificationsService,
          useValue: { createNotification: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('signed-token') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((_k: string, d?: string) => d || 'secret') },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    productsService = module.get<ProductsService>(ProductsService);
    adminService = module.get<AdminService>(AdminService);
    exceptionFilter = new HttpExceptionFilter();
  });

  // ─── Scenario 7.1: Password Hash & Secret Exclusion ────────────────────────
  describe('Scenario 7.1: Password Hash & Secret Exclusion', () => {
    it('should strip password_hash from AuthService.login response', async () => {
      const hash = await bcrypt.hash('StrongPass123!', 10);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        full_name: 'Ahmed',
        email: 'ahmed@safqa.com',
        password_hash: hash,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      });

      const res = await authService.login({
        email: 'ahmed@safqa.com',
        password: 'StrongPass123!',
      });

      expect((res.user as any).password_hash).toBeUndefined();
      expect((res.user as any).otp_code).toBeUndefined();
    });

    it('should explicitly exclude password_hash via Prisma select in AdminService.suspendUser & activateUser', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'target-user',
        status: UserStatus.ACTIVE,
        password_hash: '$2b$10$secretHashValue',
      });
      prismaMock.user.update.mockResolvedValue({
        id: 'target-user',
        full_name: 'Target',
        email: 'target@safqa.com',
        phone_number: '01012345678',
        role: UserRole.USER,
        status: UserStatus.SUSPENDED,
      });

      const suspendRes = await adminService.suspendUser('target-user', 'Spam');
      const suspendArgs = prismaMock.user.update.mock.calls[0][0];
      expect(suspendArgs.select).toBeDefined();
      expect(suspendArgs.select.password_hash).toBeUndefined();
      expect((suspendRes.user as any).password_hash).toBeUndefined();

      prismaMock.user.update.mockClear();
      prismaMock.user.update.mockResolvedValue({
        id: 'target-user',
        full_name: 'Target',
        status: UserStatus.ACTIVE,
      });
      const activateRes = await adminService.activateUser('target-user');
      const activateArgs = prismaMock.user.update.mock.calls[0][0];
      expect(activateArgs.select).toBeDefined();
      expect(activateArgs.select.password_hash).toBeUndefined();
      expect((activateRes.user as any).password_hash).toBeUndefined();
    });

    it('should exclude password_hash from UsersService.getOwnProfile query select', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        full_name: 'Ahmed',
        email: 'ahmed@safqa.com',
        products: [],
      });

      await usersService.getOwnProfile('user-1');
      const queryArgs = prismaMock.user.findUnique.mock.calls[0][0];
      expect(queryArgs.select).toBeDefined();
      expect(queryArgs.select.password_hash).toBeUndefined();
    });
  });

  // ─── Scenario 7.2: Production Error Scrubbing (No Stack Traces) ────────────
  describe('Scenario 7.2: Production Error Scrubbing (No Stack Traces or DB Schema Leaks)', () => {
    const createMockHost = () => {
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const host = {
        switchToHttp: () => ({
          getResponse: () => ({ status }),
          getRequest: () => ({ url: '/products', method: 'GET' }),
        }),
      } as unknown as ArgumentsHost;
      return { host, status, json };
    };

    it('should scrub unhandled database / Prisma exceptions in NODE_ENV=production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const { host, status, json } = createMockHost();
        const dbError = new Error(
          'PrismaClientKnownRequestError: Invalid `prisma.user.findUnique()` — relation "public.users" column "password_hash" failed at postgres://admin:secret@db.internal:5432/safqa',
        );

        exceptionFilter.catch(dbError, host);

        expect(status).toHaveBeenCalledWith(500);
        const body = json.mock.calls[0][0];
        expect(body.statusCode).toBe(500);
        expect(body.message).toBe('Internal server error');
        expect(body.stack).toBeUndefined();
        expect(JSON.stringify(body)).not.toContain('Prisma');
        expect(JSON.stringify(body)).not.toContain('password_hash');
        expect(JSON.stringify(body)).not.toContain('postgres://');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should scrub 500 InternalServerErrorException details in NODE_ENV=production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const { host, status, json } = createMockHost();
        const err = new InternalServerErrorException('SQL syntax error near SELECT * FROM users');

        exceptionFilter.catch(err, host);

        expect(status).toHaveBeenCalledWith(500);
        const body = json.mock.calls[0][0];
        expect(body.message).toBe('Internal server error');
        expect(body.stack).toBeUndefined();
        expect(JSON.stringify(body)).not.toContain('SELECT');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should preserve safe 4xx validation messages while never exposing stack traces', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const { host, status, json } = createMockHost();
        const err = new BadRequestException('Invalid product price');

        exceptionFilter.catch(err, host);

        expect(status).toHaveBeenCalledWith(400);
        const body = json.mock.calls[0][0];
        expect(body.message).toBe('Invalid product price');
        expect(body.stack).toBeUndefined();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  // ─── Scenario 7.3: User Privacy (PII Protection) ───────────────────────────
  describe('Scenario 7.3: User Privacy (PII Exclusion on Public Endpoints)', () => {
    it('should exclude private PII fields (email, phone_number, password_hash, birth_date, role, status) in UsersService.getPublicProfile', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'seller-1',
        full_name: 'Public Seller',
        avatar_url: null,
        created_at: new Date(),
        products: [],
      });

      await usersService.getPublicProfile('seller-1');

      const queryArgs = prismaMock.user.findUnique.mock.calls[0][0];
      expect(queryArgs.select).toBeDefined();
      expect(queryArgs.select.email).toBeUndefined();
      expect(queryArgs.select.phone_number).toBeUndefined();
      expect(queryArgs.select.password_hash).toBeUndefined();
      expect(queryArgs.select.birth_date).toBeUndefined();
      expect(queryArgs.select.gender).toBeUndefined();
      expect(queryArgs.select.role).toBeUndefined();
      expect(queryArgs.select.status).toBeUndefined();
    });

    it('should exclude seller email and password_hash from ProductsService.findOne', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        title: 'iPhone 15',
        status: ProductStatus.PUBLISHED,
        user: { id: 'seller-1', full_name: 'Public Seller', avatar_url: null },
      });

      await productsService.findOne('prod-1');

      const queryArgs = prismaMock.product.findUnique.mock.calls[0][0];
      const userSelect = queryArgs.include.user.select;
      expect(userSelect.email).toBeUndefined();
      expect(userSelect.password_hash).toBeUndefined();
      expect(userSelect.phone_number).toBeUndefined();
      expect(userSelect.role).toBeUndefined();
    });
  });
});
