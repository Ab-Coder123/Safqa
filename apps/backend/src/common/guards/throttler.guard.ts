import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  THROTTLE_OPTIONS_KEY,
  SKIP_THROTTLE_KEY,
  ThrottleOptions,
} from '../decorators/throttle.decorator';

interface RateLimitRecord {
  count: number;
  resetTime: number; // millisecond epoch timestamp
}

@Injectable()
export class ThrottlerGuard implements CanActivate {
  // In-memory storage: key -> RateLimitRecord
  private static readonly storage = new Map<string, RateLimitRecord>();

  // Default global rate limit: 100 requests per 60 seconds
  private readonly defaultLimit: number = 100;
  private readonly defaultTtl: number = 60;

  constructor(private readonly reflector: Reflector) {}

  /**
   * Helper to reset storage (primarily for automated testing)
   */
  public static resetStorage(): void {
    ThrottlerGuard.storage.clear();
  }

  canActivate(context: ExecutionContext): boolean {
    const isSkipped = this.reflector.getAllAndOverride<boolean>(SKIP_THROTTLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isSkipped) {
      return true;
    }

    const options = this.reflector.getAllAndOverride<ThrottleOptions>(
      THROTTLE_OPTIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const limit = options?.limit ?? this.defaultLimit;
    const ttl = options?.ttl ?? this.defaultTtl;

    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const trackerKey = this.generateKey(req, context);
    const now = Date.now();

    let record = ThrottlerGuard.storage.get(trackerKey);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + ttl * 1000,
      };
      ThrottlerGuard.storage.set(trackerKey, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, limit - record.count);
    const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

    // Attach rate limit headers to response if supported
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', limit.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());
    }

    if (record.count > limit) {
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', resetSeconds.toString());
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too Many Requests',
          retryAfter: resetSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Housekeeping if storage grows too large
    if (ThrottlerGuard.storage.size > 10000) {
      this.pruneExpired(now);
    }

    return true;
  }

  private generateKey(req: any, context: ExecutionContext): string {
    const handlerKey = `${context.getClass()?.name || 'Class'}:${context.getHandler()?.name || 'Handler'}`;

    // Prefer authenticated user id if present
    if (req?.user?.sub) {
      return `user:${req.user.sub}:${handlerKey}`;
    }

    // Otherwise use client IP
    const clientIp = this.getClientIp(req);
    return `ip:${clientIp}:${handlerKey}`;
  }

  private getClientIp(req: any): string {
    if (!req) return '127.0.0.1';

    const forwarded = req.headers?.['x-forwarded-for'];
    if (forwarded) {
      if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
      }
      if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0].trim();
      }
    }

    return (
      req.ip ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      '127.0.0.1'
    );
  }

  private pruneExpired(now: number): void {
    for (const [key, record] of ThrottlerGuard.storage.entries()) {
      if (now > record.resetTime) {
        ThrottlerGuard.storage.delete(key);
      }
    }
  }
}
