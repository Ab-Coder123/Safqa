import { Request, Response, NextFunction } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const ALLOWED_HTTP_METHODS = new Set([
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
]);

const BLOCKED_HTTP_METHODS = new Set(['TRACE', 'TRACK', 'CONNECT']);

/**
 * Resolves the allowed CORS origins whitelist from environment variables.
 */
export function getAllowedCorsOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  const configured = env.CORS_ORIGINS || env.FRONTEND_URL || '';
  const parsed = configured
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  if (parsed.length > 0) {
    return parsed;
  }

  // Safe local defaults when no explicit CORS_ORIGINS is configured
  return ['http://localhost:3000', 'http://127.0.0.1:3000'];
}

const SAFQA_VERCEL_ORIGIN_PATTERN = /^https:\/\/safqa(?:-[a-z0-9-]+)?\.vercel\.app$/i;

/**
 * Builds strict NestJS CORS options rejecting unknown cross-origin requests.
 */
export function buildCorsOptions(env: NodeJS.ProcessEnv = process.env): CorsOptions {
  const hasExplicitOrigins = Boolean(env.CORS_ORIGINS || env.FRONTEND_URL);
  const allowedOrigins = getAllowedCorsOrigins(env);

  return {
    origin: (origin, callback) => {
      // Allow server-to-server / non-browser requests with no Origin header
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // If no explicit CORS_ORIGINS env var is configured yet, allow only official Safqa Vercel deployments
      if (!hasExplicitOrigins && SAFQA_VERCEL_ORIGIN_PATTERN.test(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS policy'), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'],
    maxAge: 600,
  };
}

/**
 * Helmet-equivalent HTTP Security Headers & Method Restriction middleware.
 * Protects against Clickjacking, MIME-sniffing, protocol downgrade, and XST (TRACE/TRACK).
 */
export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const method = (req.method || '').toUpperCase();

  // Block dangerous / unexpected HTTP methods (TRACE, TRACK, CONNECT, etc.)
  if (BLOCKED_HTTP_METHODS.has(method) || !ALLOWED_HTTP_METHODS.has(method)) {
    res.setHeader('Allow', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    res.status(405).json({
      statusCode: 405,
      message: `HTTP method ${method} is not allowed`,
      error: 'Method Not Allowed',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Remove Express fingerprinting header
  if (typeof res.removeHeader === 'function') {
    res.removeHeader('X-Powered-By');
  }

  // Enforce OWASP / Helmet Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; frame-ancestors 'none'",
  );
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Allow cross-origin image loading from /uploads (e.g. Vercel frontend loading Railway backend images)
  if (req.path && req.path.startsWith('/uploads')) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  } else {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  }

  next();
}
