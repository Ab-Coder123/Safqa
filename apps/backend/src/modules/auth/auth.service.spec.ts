import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user and return Registration successful', async () => {
    // service calls findUnique for email, then findUnique for phone — both return null (not taken)
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'user-1',
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      password_hash: 'hashed',
    });

    const dto = {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone_number: '01012345678',
      gender: 'MALE' as any,
      birth_date: '1995-01-01',
    };

    const result = await service.register(dto);

    expect(result.message).toBe('Registration successful');
    expect(result.user.id).toBe('user-1');
    // password_hash must be stripped from response (Privacy Rule)
    expect((result.user as any).password_hash).toBeUndefined();
    expect(result.tokens.accessToken).toBe('mock_token');
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if email is already registered', async () => {
    // service calls findUnique for email first — return existing user
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing-1' });

    const dto = {
      full_name: 'Test User',
      email: 'taken@example.com',
      password: 'password123',
      phone_number: '01099999999',
      gender: 'MALE' as any,
      birth_date: '1995-01-01',
    };

    await expect(service.register(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if phone number is already registered', async () => {
    // email check passes (null), phone check finds existing user
    prismaMock.user.findUnique
      .mockResolvedValueOnce(null)          // email lookup: not found
      .mockResolvedValueOnce({ id: 'existing-2' }); // phone lookup: found

    const dto = {
      full_name: 'Test User',
      email: 'new@example.com',
      password: 'password123',
      phone_number: '01012345678',
      gender: 'MALE' as any,
      birth_date: '1995-01-01',
    };

    await expect(service.register(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException on invalid login credentials (user not found)', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'wrong@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should process forgotPassword, verifyOtp, and resetPassword successfully', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      status: 'ACTIVE',
    });
    prismaMock.user.update = jest.fn().mockResolvedValue({ id: 'user-1' });

    // 1. Forgot password
    const res1 = await service.forgotPassword({ email: 'user@example.com' });
    expect(res1.message).toContain('رمز التحقق');
    expect(res1.debug_code).toBeDefined();

    const code = res1.debug_code || '123456';

    // 2. Verify OTP
    const res2 = await service.verifyOtp({ email: 'user@example.com', code });
    expect(res2.verified).toBe(true);

    // 3. Reset password
    const res3 = await service.resetPassword({
      email: 'user@example.com',
      code,
      new_password: 'newPassword123',
    });
    expect(res3.message).toContain('تم تغيير كلمة المرور');
    expect(prismaMock.user.update).toHaveBeenCalled();
  });
});

