import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard } from '../../src/common/guards/throttler.guard';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { ConversationsController } from '../../src/modules/conversations/conversations.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from '@safqa/types';

describe('Tier 04 — Rate Limiting, Throttling & Brute-Force Mitigation (Security Suite)', () => {
  let throttlerGuard: ThrottlerGuard;
  let reflector: Reflector;
  let authService: AuthService;
  let prismaMock: any;

  const createMockContext = (options: {
    ip?: string;
    forwardedFor?: string;
    user?: any;
    handler: Function;
    classType: any;
  }): { context: ExecutionContext; responseHeaders: Record<string, string> } => {
    const responseHeaders: Record<string, string> = {};

    const req: any = {
      ip: options.ip || '192.168.1.100',
      headers: {
        ...(options.forwardedFor ? { 'x-forwarded-for': options.forwardedFor } : {}),
      },
      user: options.user,
    };

    const res: any = {
      setHeader: jest.fn((key: string, value: string) => {
        responseHeaders[key.toLowerCase()] = value;
      }),
    };

    const context = {
      getHandler: () => options.handler,
      getClass: () => options.classType,
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ExecutionContext;

    return { context, responseHeaders };
  };

  beforeEach(async () => {
    ThrottlerGuard.resetStorage();

    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const configMock = {
      get: jest.fn((key: string, defaultVal?: string) => defaultVal || 'test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThrottlerGuard,
        Reflector,
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() } },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    throttlerGuard = module.get<ThrottlerGuard>(ThrottlerGuard);
    reflector = module.get<Reflector>(Reflector);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Scenario 4.1: Login Endpoint Brute-Force Defense', () => {
    it('should allow up to 5 login requests per minute from the same IP', () => {
      const loginHandler = AuthController.prototype.login;

      for (let i = 1; i <= 5; i++) {
        const { context, responseHeaders } = createMockContext({
          ip: '10.0.0.1',
          handler: loginHandler,
          classType: AuthController,
        });

        expect(throttlerGuard.canActivate(context)).toBe(true);
        expect(responseHeaders['x-ratelimit-limit']).toBe('5');
        expect(responseHeaders['x-ratelimit-remaining']).toBe((5 - i).toString());
      }
    });

    it('should block the 6th login request from the same IP with HTTP 429 Too Many Requests', () => {
      const loginHandler = AuthController.prototype.login;

      for (let i = 1; i <= 5; i++) {
        const { context } = createMockContext({
          ip: '10.0.0.2',
          handler: loginHandler,
          classType: AuthController,
        });
        throttlerGuard.canActivate(context);
      }

      const { context: excessContext, responseHeaders } = createMockContext({
        ip: '10.0.0.2',
        handler: loginHandler,
        classType: AuthController,
      });

      try {
        throttlerGuard.canActivate(excessContext);
        fail('Expected 6th login attempt to throw 429');
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(responseHeaders['retry-after']).toBeDefined();
        expect(parseInt(responseHeaders['retry-after'])).toBeGreaterThan(0);
      }
    });
  });

  describe('Scenario 4.2: Registration & Account Creation Flooding', () => {
    it('should enforce limit of 5 registration calls per minute per IP', () => {
      const registerHandler = AuthController.prototype.register;

      for (let i = 1; i <= 5; i++) {
        const { context } = createMockContext({
          ip: '10.0.0.50',
          handler: registerHandler,
          classType: AuthController,
        });
        expect(throttlerGuard.canActivate(context)).toBe(true);
      }

      const { context: blockedContext } = createMockContext({
        ip: '10.0.0.50',
        handler: registerHandler,
        classType: AuthController,
      });

      expect(() => throttlerGuard.canActivate(blockedContext)).toThrow(HttpException);
      try {
        throttlerGuard.canActivate(blockedContext);
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });
  });

  describe('Scenario 4.3: Password Reset & OTP Generation Spam Defense', () => {
    it('should throttle POST /auth/forgot-password route after 3 requests from the same IP', () => {
      const forgotHandler = AuthController.prototype.forgotPassword;

      for (let i = 1; i <= 3; i++) {
        const { context, responseHeaders } = createMockContext({
          ip: '10.0.0.70',
          handler: forgotHandler,
          classType: AuthController,
        });
        expect(throttlerGuard.canActivate(context)).toBe(true);
        expect(responseHeaders['x-ratelimit-limit']).toBe('3');
      }

      const { context: blockedContext } = createMockContext({
        ip: '10.0.0.70',
        handler: forgotHandler,
        classType: AuthController,
      });

      expect(() => throttlerGuard.canActivate(blockedContext)).toThrow(HttpException);
    });

    it('should enforce a 60-second cooldown per email in AuthService to prevent OTP SMS/Email spam', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-target-1',
        email: 'victim@safqa.com',
        status: UserStatus.ACTIVE,
      });

      // 1st OTP request succeeds
      const res1 = await authService.forgotPassword({ email: 'victim@safqa.com' });
      expect(res1.message).toContain('رمز التحقق');

      // 2nd rapid OTP request for same email immediately fails with 429 cooldown
      await expect(
        authService.forgotPassword({ email: 'victim@safqa.com' }),
      ).rejects.toThrow(HttpException);

      try {
        await authService.forgotPassword({ email: 'victim@safqa.com' });
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(err.getResponse().message).toContain('يرجى الانتظار');
      }
    });

    it('should allow OTP request for a different email without being affected by another user cooldown', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-target-2',
        email: 'other@safqa.com',
        status: UserStatus.ACTIVE,
      });

      const res = await authService.forgotPassword({ email: 'other@safqa.com' });
      expect(res.message).toContain('رمز التحقق');
    });
  });

  describe('Scenario 4.4: Chat Message Flooding Prevention', () => {
    it('should allow up to 30 messages per minute for an authenticated user', () => {
      const sendMsgHandler = ConversationsController.prototype.sendMessage;

      for (let i = 1; i <= 30; i++) {
        const { context, responseHeaders } = createMockContext({
          user: { sub: 'chatty-user-1' },
          handler: sendMsgHandler,
          classType: ConversationsController,
        });

        expect(throttlerGuard.canActivate(context)).toBe(true);
        expect(responseHeaders['x-ratelimit-limit']).toBe('30');
      }
    });

    it('should block 31st chat message from the same user with HTTP 429', () => {
      const sendMsgHandler = ConversationsController.prototype.sendMessage;

      for (let i = 1; i <= 30; i++) {
        const { context } = createMockContext({
          user: { sub: 'spammer-user-99' },
          handler: sendMsgHandler,
          classType: ConversationsController,
        });
        throttlerGuard.canActivate(context);
      }

      const { context: excessContext } = createMockContext({
        user: { sub: 'spammer-user-99' },
        handler: sendMsgHandler,
        classType: ConversationsController,
      });

      expect(() => throttlerGuard.canActivate(excessContext)).toThrow(HttpException);
      try {
        throttlerGuard.canActivate(excessContext);
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });
  });

  describe('Scenario 4.5: OTP Brute-Force & Lockout Defense', () => {
    it('should lock out and invalidate OTP after 5 failed verification attempts', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'target-otp-user',
        email: 'otp-test@safqa.com',
        status: UserStatus.ACTIVE,
      });

      // Request OTP
      const reqRes = await authService.forgotPassword({ email: 'otp-test@safqa.com' });
      const realCode = reqRes.debug_code;

      // 4 wrong attempts should be rejected with remaining count
      for (let attempt = 1; attempt <= 4; attempt++) {
        await expect(
          authService.verifyOtp({ email: 'otp-test@safqa.com', code: '000000' }),
        ).rejects.toThrow(BadRequestException);
      }

      // 5th wrong attempt triggers lockout (HTTP 429) and invalidates code
      await expect(
        authService.verifyOtp({ email: 'otp-test@safqa.com', code: '000000' }),
      ).rejects.toThrow(HttpException);

      try {
        await authService.verifyOtp({ email: 'otp-test@safqa.com', code: '000000' });
      } catch (err: any) {
        // Now code is invalidated, subsequent calls fail because code is gone
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toContain('لم يتم طلب رمز تحقق');
      }

      // Even the original correct code should now be invalid
      await expect(
        authService.verifyOtp({ email: 'otp-test@safqa.com', code: realCode! }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 4.6: Client & User Rate-Limit Isolation', () => {
    it('should not block IP B when IP A is rate-limited on the login endpoint', () => {
      const loginHandler = AuthController.prototype.login;

      // Exhaust IP A
      for (let i = 1; i <= 5; i++) {
        const { context } = createMockContext({
          ip: '172.16.0.1',
          handler: loginHandler,
          classType: AuthController,
        });
        throttlerGuard.canActivate(context);
      }

      // Verify IP A is blocked
      const { context: ipAContext } = createMockContext({
        ip: '172.16.0.1',
        handler: loginHandler,
        classType: AuthController,
      });
      expect(() => throttlerGuard.canActivate(ipAContext)).toThrow(HttpException);

      // Verify IP B is unaffected and allowed
      const { context: ipBContext } = createMockContext({
        ip: '172.16.0.2',
        handler: loginHandler,
        classType: AuthController,
      });
      expect(throttlerGuard.canActivate(ipBContext)).toBe(true);
    });

    it('should not block User B when User A is rate-limited on chat messages', () => {
      const sendMsgHandler = ConversationsController.prototype.sendMessage;

      // Exhaust User A
      for (let i = 1; i <= 30; i++) {
        const { context } = createMockContext({
          user: { sub: 'user-exhausted' },
          handler: sendMsgHandler,
          classType: ConversationsController,
        });
        throttlerGuard.canActivate(context);
      }

      // Verify User B can still send messages freely
      const { context: userBContext } = createMockContext({
        user: { sub: 'user-clean' },
        handler: sendMsgHandler,
        classType: ConversationsController,
      });
      expect(throttlerGuard.canActivate(userBContext)).toBe(true);
    });
  });
});
