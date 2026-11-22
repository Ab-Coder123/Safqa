import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserRole, UserStatus } from '@safqa/types';

describe('Tier 01 — JWT Authentication & Session Hardening (Security Suite)', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaMock: any;

  const ACCESS_SECRET = 'test-access-secret-key-safe-256';
  const REFRESH_SECRET = 'test-refresh-secret-key-safe-256';

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const req: any = {
      headers: authHeader ? { authorization: authHeader } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const configMock = {
      get: jest.fn((key: string, defaultVal?: string) => {
        if (key === 'JWT_ACCESS_SECRET') return ACCESS_SECRET;
        if (key === 'JWT_REFRESH_SECRET') return REFRESH_SECRET;
        if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return defaultVal;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        JwtAuthGuard,
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // ─── Scenario 1.1: None-Algorithm & Signature Tampering ────────────────────
  describe('Scenario 1.1: None-Algorithm & Signature Tampering', () => {
    it('should reject a forged token using "alg": "none" with empty signature', async () => {
      const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(
        JSON.stringify({ sub: 'admin-1', email: 'admin@safqa.com', role: UserRole.SUPER_ADMIN, type: 'access' }),
      ).toString('base64url');
      const forgedNoneToken = `${header}.${payload}.`;

      const ctx = createMockContext(`Bearer ${forgedNoneToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject a valid token whose payload was tampered with (role elevation to SUPER_ADMIN)', async () => {
      const validToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'access' },
        { secret: ACCESS_SECRET, algorithm: 'HS256' },
      );

      const parts = validToken.split('.');
      const tamperedPayload = Buffer.from(
        JSON.stringify({ sub: 'user-1', email: 'user@safqa.com', role: UserRole.SUPER_ADMIN, type: 'access' }),
      ).toString('base64url');
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      const ctx = createMockContext(`Bearer ${tamperedToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject a token signed with an attacker-controlled secret', async () => {
      const attackerToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.SUPER_ADMIN, type: 'access' },
        { secret: 'attacker-wrong-secret-key', algorithm: 'HS256' },
      );

      const ctx = createMockContext(`Bearer ${attackerToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── Scenario 1.2: Expired Access Token Rejection ──────────────────────────
  describe('Scenario 1.2: Expired Access Token Rejection', () => {
    it('should reject an expired access token immediately', async () => {
      const expiredToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'access' },
        { secret: ACCESS_SECRET, expiresIn: '-10s', algorithm: 'HS256' },
      );

      const ctx = createMockContext(`Bearer ${expiredToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject an expired refresh token on /auth/refresh', async () => {
      const expiredRefresh = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'refresh' },
        { secret: REFRESH_SECRET, expiresIn: '-10s', algorithm: 'HS256' },
      );

      await expect(authService.refreshToken({ refreshToken: expiredRefresh })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── Scenario 1.3: Token Secret Separation & Type Confusion ────────────────
  describe('Scenario 1.3: Token Secret Separation & Type Confusion', () => {
    it('should reject a valid RefreshToken when used as an AccessToken on protected routes', async () => {
      const refreshToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'refresh' },
        { secret: REFRESH_SECRET, expiresIn: '7d', algorithm: 'HS256' },
      );

      const ctx = createMockContext(`Bearer ${refreshToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject a refresh token even if secrets were accidentally identical (via explicit type claim)', async () => {
      const confusedToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'refresh' },
        { secret: ACCESS_SECRET, expiresIn: '7d', algorithm: 'HS256' },
      );

      const ctx = createMockContext(`Bearer ${confusedToken}`);
      await expect(jwtAuthGuard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject an AccessToken when sent to refreshToken endpoint', async () => {
      const accessToken = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'access' },
        { secret: ACCESS_SECRET, expiresIn: '15m', algorithm: 'HS256' },
      );

      await expect(authService.refreshToken({ refreshToken: accessToken })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject an AccessToken signed with refresh secret due to type !== "refresh"', async () => {
      const accessWithRefreshSecret = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'access' },
        { secret: REFRESH_SECRET, expiresIn: '15m', algorithm: 'HS256' },
      );

      await expect(
        authService.refreshToken({ refreshToken: accessWithRefreshSecret }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── Scenario 1.4: Revoked / Invalidated Session & Malformed Headers ──────
  describe('Scenario 1.4: Revoked / Suspended User Refresh & Malformed Headers', () => {
    it('should reject refresh token if user account was suspended after login', async () => {
      const validRefresh = await jwtService.signAsync(
        { sub: 'user-suspended', email: 'suspended@safqa.com', role: UserRole.USER, type: 'refresh' },
        { secret: REFRESH_SECRET, expiresIn: '7d', algorithm: 'HS256' },
      );

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-suspended',
        email: 'suspended@safqa.com',
        status: UserStatus.SUSPENDED,
      });

      await expect(authService.refreshToken({ refreshToken: validRefresh })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject refresh token if user account was deleted', async () => {
      const validRefresh = await jwtService.signAsync(
        { sub: 'user-deleted', email: 'deleted@safqa.com', role: UserRole.USER, type: 'refresh' },
        { secret: REFRESH_SECRET, expiresIn: '7d', algorithm: 'HS256' },
      );

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-deleted',
        email: 'deleted@safqa.com',
        status: UserStatus.DELETED,
      });

      await expect(authService.refreshToken({ refreshToken: validRefresh })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject missing Authorization header or non-Bearer schemes', async () => {
      await expect(jwtAuthGuard.canActivate(createMockContext())).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(jwtAuthGuard.canActivate(createMockContext('Basic dXNlcjpwYXNz'))).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(jwtAuthGuard.canActivate(createMockContext('Bearer '))).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should allow valid access token with HS256 and type="access"', async () => {
      const validAccess = await jwtService.signAsync(
        { sub: 'user-1', email: 'user@safqa.com', role: UserRole.USER, type: 'access' },
        { secret: ACCESS_SECRET, expiresIn: '15m', algorithm: 'HS256' },
      );

      const ctx = createMockContext(`Bearer ${validAccess}`);
      const canActivate = await jwtAuthGuard.canActivate(ctx);
      expect(canActivate).toBe(true);
    });
  });
});
