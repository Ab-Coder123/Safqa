import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
