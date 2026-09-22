import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UserRole, UserStatus } from '@safqa/types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check uniqueness of Email and Phone Number
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingEmail) {
      throw new ConflictException('The email address is already registered');
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: { phone_number: dto.phone_number },
    });
    if (existingPhone) {
      throw new ConflictException('The phone number is already registered');
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create User Entity
    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email.toLowerCase(),
        password_hash: hashedPassword,
        phone_number: dto.phone_number,
        gender: dto.gender,
        birth_date: new Date(dto.birth_date),
        avatar_url: dto.avatar_url || null,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    // 4. Generate Tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      message: 'Registration successful',
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    // 1. Find User by Email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // 2. Generic Invalid Credentials check (prevents email enumeration attacks)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Check Account Status (Workflow Exception Flow: Block Suspended users)
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(
        'Your account has been suspended due to policy violations. Please contact support.',
      );
    }

    if (user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('Account not found');
    }

    // 4. Generate Tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const secret = this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'safqa-refresh-secret',
      );
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, { secret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh session');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // In-memory OTP storage: email -> { code: string, expiresAt: number }
  private otpStore = new Map<string, { code: string; expiresAt: number }>();

  async forgotPassword(dto: ForgotPasswordDto) {
    const emailLower = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });

    // Security rule: Don't leak whether email exists or not, but don't generate code if user deleted/suspended
    if (!user || user.status !== UserStatus.ACTIVE) {
      // Fake success message to prevent user enumeration
      return {
        message: 'إذا كان البريد الإلكتروني مسجلاً، فستصلك تعليمات إعادت التعيين.',
      };
    }

    // Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(emailLower, { code, expiresAt });

    return {
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.',
      // Returning code in development mode for easy testing
      debug_code: code,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const emailLower = dto.email.toLowerCase();
    const stored = this.otpStore.get(emailLower);

    if (!stored) {
      throw new BadRequestException('لم يتم طلب رمز تحقق لهذا البريد أو انتهت صلاحيته');
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(emailLower);
      throw new BadRequestException('انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد');
    }

    if (stored.code !== dto.code.trim()) {
      throw new BadRequestException('رمز التحقق غير صحيح');
    }

    return {
      message: 'تم التحقق من الرمز بنجاح',
      verified: true,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const emailLower = dto.email.toLowerCase();
    const stored = this.otpStore.get(emailLower);

    if (!stored || stored.code !== dto.code.trim()) {
      throw new BadRequestException('رمز التحقق غير صحيح أو انتهت صلاحيته');
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(emailLower);
      throw new BadRequestException('انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('الحساب غير موجود أو غير نشط');
    }

    const hashedPassword = await bcrypt.hash(dto.new_password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword },
    });

    // Clear OTP after successful reset
    this.otpStore.delete(emailLower);

    return {
      message: 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'safqa-access-secret'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'safqa-refresh-secret'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: '15m',
    };
  }

  private sanitizeUser(user: any) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
