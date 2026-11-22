import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RegisterDto } from '../../src/modules/auth/dto/register.dto';
import { ResetPasswordDto } from '../../src/modules/auth/dto/forgot-password.dto';
import { UserRole, UserStatus, UserGender } from '@safqa/types';

describe('Tier 05 — Password Hashing, Credentials Lifecycle & OTP Security (Security Suite)', () => {
  let authService: AuthService;
  let prismaMock: any;

  beforeEach(async () => {
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
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('jwt-mock-token') } },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('Scenario 5.1: Strong Hashing Algorithm & Salt Verification', () => {
    it('should hash passwords using bcrypt with 10 salt rounds and never store or return plaintext', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      let savedData: any = null;
      prismaMock.user.create.mockImplementation((args: any) => {
        savedData = args.data;
        return Promise.resolve({
          id: 'user-hashing-1',
          ...args.data,
        });
      });

      const registerDto: RegisterDto = {
        full_name: 'Ahmed Security',
        email: 'ahmed.sec@safqa.com',
        password: 'SuperSecretPassword@2026',
        phone_number: '01012345678',
        gender: UserGender.MALE,
        birth_date: '1995-05-15',
      };

      const result = await authService.register(registerDto);

      // Verify DB storage
      expect(savedData).toBeDefined();
      expect(savedData.password_hash).not.toBe('SuperSecretPassword@2026');
      expect(savedData.password_hash).toMatch(/^\$2[ab]\$10\$/); // Valid bcrypt with 10 rounds

      // Verify bcrypt can verify the password
      const isValid = await bcrypt.compare('SuperSecretPassword@2026', savedData.password_hash);
      expect(isValid).toBe(true);

      // Verify returned sanitized user never exposes password_hash
      expect((result.user as any).password_hash).toBeUndefined();
      expect((result.user as any).password).toBeUndefined();
    });
  });

  describe('Scenario 5.2: OTP Expiration & Single-Use Enforcement', () => {
    it('should reject expired OTPs with 400 Bad Request after TTL passes', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-otp-exp',
        email: 'expire-test@safqa.com',
        status: UserStatus.ACTIVE,
      });

      // Request OTP
      const res = await authService.forgotPassword({ email: 'expire-test@safqa.com' });
      const otpCode = res.debug_code || '123456';

      // Access private otpStore and advance expiresAt to simulate passage of > 10 minutes
      const store: Map<string, any> = (authService as any).otpStore;
      const record = store.get('expire-test@safqa.com');
      expect(record).toBeDefined();
      record.expiresAt = Date.now() - 1000; // Expired 1 second ago

      await expect(
        authService.verifyOtp({ email: 'expire-test@safqa.com', code: otpCode }),
      ).rejects.toThrow(BadRequestException);

      // Verify expired OTP was purged from store
      expect(store.get('expire-test@safqa.com')).toBeUndefined();
    });

    it('should strictly enforce single-use of OTPs (replay attack prevention)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-replay-1',
        email: 'single-use@safqa.com',
        status: UserStatus.ACTIVE,
      });
      prismaMock.user.update.mockResolvedValue({ id: 'user-replay-1' });

      // 1. Request OTP
      const res = await authService.forgotPassword({ email: 'single-use@safqa.com' });
      const otpCode = res.debug_code!;

      // 2. Verify OTP
      const verifyRes = await authService.verifyOtp({
        email: 'single-use@safqa.com',
        code: otpCode,
      });
      expect(verifyRes.verified).toBe(true);

      // 3. Reset Password (first valid use)
      const resetRes = await authService.resetPassword({
        email: 'single-use@safqa.com',
        code: otpCode,
        new_password: 'ValidNewPassword123',
      });
      expect(resetRes.message).toContain('تم تغيير كلمة المرور بنجاح');

      // 4. Replay attempt with the exact same OTP code must fail
      await expect(
        authService.resetPassword({
          email: 'single-use@safqa.com',
          code: otpCode,
          new_password: 'AnotherPassword456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 5.3: OTP Brute-Force Resistance & Lockout', () => {
    it('should permanently invalidate OTP and lock out after 5 consecutive incorrect attempts', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-bruteforce-1',
        email: 'brute@safqa.com',
        status: UserStatus.ACTIVE,
      });

      const res = await authService.forgotPassword({ email: 'brute@safqa.com' });
      const legitimateCode = res.debug_code!;

      // 4 wrong attempts
      for (let i = 1; i <= 4; i++) {
        await expect(
          authService.verifyOtp({ email: 'brute@safqa.com', code: '999999' }),
        ).rejects.toThrow(BadRequestException);
      }

      // 5th attempt triggers lockout (429)
      try {
        await authService.verifyOtp({ email: 'brute@safqa.com', code: '999999' });
        fail('Expected 5th attempt to trigger lockout 429');
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }

      // 6th attempt: Even if legitimate code is now provided, it MUST fail because code was purged
      await expect(
        authService.verifyOtp({ email: 'brute@safqa.com', code: legitimateCode }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 5.4: Reset Password Flow & Token Hijack Prevention', () => {
    it('should reject resetPassword if verifyOtp was never completed first', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-bypass-1',
        email: 'bypass@safqa.com',
        status: UserStatus.ACTIVE,
      });

      const res = await authService.forgotPassword({ email: 'bypass@safqa.com' });
      const code = res.debug_code!;

      // Attempt calling resetPassword directly without verifyOtp
      await expect(
        authService.resetPassword({
          email: 'bypass@safqa.com',
          code,
          new_password: 'Password123456',
        }),
      ).rejects.toThrow(BadRequestException);

      try {
        await authService.resetPassword({
          email: 'bypass@safqa.com',
          code,
          new_password: 'Password123456',
        });
      } catch (err: any) {
        expect(err.message).toContain('يجب التحقق من رمز التأكيد أولاً');
      }
    });

    it('should reject weak or excessively long passwords via DTO validation', async () => {
      // 1. Password shorter than 8 characters
      const shortDto = plainToInstance(ResetPasswordDto, {
        email: 'valid@safqa.com',
        code: '123456',
        new_password: '123',
      });
      const shortErrors = await validate(shortDto);
      expect(shortErrors.length).toBeGreaterThan(0);
      expect(shortErrors.some((e) => e.property === 'new_password')).toBe(true);

      // 2. Password longer than 128 characters
      const longDto = plainToInstance(ResetPasswordDto, {
        email: 'valid@safqa.com',
        code: '123456',
        new_password: 'A'.repeat(129),
      });
      const longErrors = await validate(longDto);
      expect(longErrors.length).toBeGreaterThan(0);
      expect(longErrors.some((e) => e.property === 'new_password')).toBe(true);

      // 3. Valid password (8-128 characters)
      const validDto = plainToInstance(ResetPasswordDto, {
        email: 'valid@safqa.com',
        code: '123456',
        new_password: 'ValidSecurePassword123!',
      });
      const validErrors = await validate(validDto);
      expect(validErrors.length).toBe(0);
    });
  });

  describe('Scenario 5.5: Production OTP Leakage Prevention', () => {
    it('should NEVER include debug_code in forgotPassword response when NODE_ENV is production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        prismaMock.user.findUnique.mockResolvedValue({
          id: 'user-prod-1',
          email: 'prod@safqa.com',
          status: UserStatus.ACTIVE,
        });

        const res = await authService.forgotPassword({ email: 'prod@safqa.com' });
        expect(res.message).toBeDefined();
        expect(res.debug_code).toBeUndefined();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
