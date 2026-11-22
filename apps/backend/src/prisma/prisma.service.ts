import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Validates that external production PostgreSQL connections enforce TLS/SSL (e.g. sslmode=require).
 */
export function validateDatabaseUrlSecurity(
  databaseUrl: string | undefined,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): { secure: boolean; reason?: string } {
  if (!databaseUrl) {
    return { secure: false, reason: 'DATABASE_URL is not configured' };
  }

  // Local development or private internal Railway mesh does not require public SSL query params
  const isLocalOrInternal =
    /@(localhost|127\.0\.0\.1|postgres|db|[^/]+\.railway\.internal)(:|\/|$)/i.test(
      databaseUrl,
    );

  if (nodeEnv !== 'production' || isLocalOrInternal) {
    return { secure: true };
  }

  const hasSslRequired = /[?&]sslmode=(require|verify-ca|verify-full)\b/i.test(
    databaseUrl,
  );

  if (!hasSslRequired) {
    return {
      secure: false,
      reason: 'External production DATABASE_URL must enforce sslmode=require',
    };
  }

  return { secure: true };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const sslCheck = validateDatabaseUrlSecurity(
      process.env.DATABASE_URL,
      process.env.NODE_ENV,
    );
    if (!sslCheck.secure) {
      this.logger.warn(`Database TLS warning: ${sslCheck.reason}`);
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
