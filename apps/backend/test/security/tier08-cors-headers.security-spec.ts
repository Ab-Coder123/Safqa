import { Request, Response } from 'express';
import {
  buildCorsOptions,
  getAllowedCorsOrigins,
  securityHeadersMiddleware,
} from '../../src/common/security/http-security.config';

describe('Tier 08 — CORS, HTTP Security Headers & Network Defense (Security Suite)', () => {
  // ─── Scenario 8.1: CORS Whitelist Verification ─────────────────────────────
  describe('Scenario 8.1: Strict CORS Whitelist Verification', () => {
    const evaluateOrigin = (
      corsOptions: any,
      origin: string | undefined,
    ): Promise<{ err: Error | null; allowed: boolean }> =>
      new Promise((resolve) => {
        corsOptions.origin(origin, (err: Error | null, allowed: boolean) => {
          resolve({ err, allowed });
        });
      });

    it('should reject unauthorized Origin (https://evil-attacker.com) and never allow wildcard *', async () => {
      const corsOptions = buildCorsOptions({
        CORS_ORIGINS: 'https://safqa.com,https://app.safqa.com',
      } as any);

      expect(corsOptions.origin).not.toBe('*');

      const evilResult = await evaluateOrigin(corsOptions, 'https://evil-attacker.com');
      expect(evilResult.err).toBeInstanceOf(Error);
      expect(evilResult.allowed).toBe(false);

      const spoofedResult = await evaluateOrigin(corsOptions, 'https://safqa.com.evil.com');
      expect(spoofedResult.err).toBeInstanceOf(Error);
      expect(spoofedResult.allowed).toBe(false);
    });

    it('should allow explicitly whitelisted origins from CORS_ORIGINS', async () => {
      const corsOptions = buildCorsOptions({
        CORS_ORIGINS: 'https://safqa.com, http://localhost:3000/',
      } as any);

      const allowed1 = await evaluateOrigin(corsOptions, 'https://safqa.com');
      expect(allowed1.err).toBeNull();
      expect(allowed1.allowed).toBe(true);

      const allowed2 = await evaluateOrigin(corsOptions, 'http://localhost:3000');
      expect(allowed2.err).toBeNull();
      expect(allowed2.allowed).toBe(true);
    });

    it('should block unrelated third-party vercel origins when using fallback defaults', async () => {
      const corsOptions = buildCorsOptions({} as any);
      expect(getAllowedCorsOrigins({} as any)).toContain('http://localhost:3000');

      const evilVercel = await evaluateOrigin(corsOptions, 'https://evil-phisher.vercel.app');
      expect(evilVercel.err).toBeInstanceOf(Error);
      expect(evilVercel.allowed).toBe(false);

      const officialVercel = await evaluateOrigin(corsOptions, 'https://safqa-web.vercel.app');
      expect(officialVercel.err).toBeNull();
      expect(officialVercel.allowed).toBe(true);
    });
  });

  // ─── Scenario 8.2: Security Headers (Helmet Inspection) ────────────────────
  describe('Scenario 8.2: OWASP HTTP Security Headers Enforcement', () => {
    const createMockRes = () => {
      const headers: Record<string, string> = {};
      const removed: string[] = [];
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const res = {
        setHeader: jest.fn((k: string, v: string) => {
          headers[k.toLowerCase()] = v;
        }),
        removeHeader: jest.fn((k: string) => {
          removed.push(k.toLowerCase());
        }),
        status,
        json,
      } as unknown as Response;
      return { res, headers, removed, status, json };
    };

    it('should attach all mandatory OWASP / Helmet security headers and strip X-Powered-By', () => {
      const req = { method: 'GET', path: '/products' } as unknown as Request;
      const { res, headers, removed } = createMockRes();
      const next = jest.fn();

      securityHeadersMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(removed).toContain('x-powered-by');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['strict-transport-security']).toContain('max-age=31536000');
      expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
      expect(headers['x-xss-protection']).toBe('0');
      expect(headers['referrer-policy']).toBe('no-referrer');
      expect(headers['cross-origin-resource-policy']).toBe('same-origin');
    });

    it('should allow cross-origin media rendering for /uploads static files without weakening other headers', () => {
      const req = { method: 'GET', path: '/uploads/sample.jpg' } as unknown as Request;
      const { res, headers } = createMockRes();
      const next = jest.fn();

      securityHeadersMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(headers['cross-origin-resource-policy']).toBe('cross-origin');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBe('DENY');
    });
  });

  // ─── Scenario 8.3: HTTP Methods Restriction ────────────────────────────────
  describe('Scenario 8.3: Dangerous HTTP Methods Restriction (TRACE, TRACK, CONNECT)', () => {
    it('should reject TRACE, TRACK, and CONNECT requests with 405 Method Not Allowed', () => {
      const dangerousMethods = ['TRACE', 'TRACK', 'CONNECT', 'PROPFIND'];

      for (const method of dangerousMethods) {
        const req = { method, path: '/products' } as unknown as Request;
        const json = jest.fn();
        const status = jest.fn().mockReturnValue({ json });
        const setHeader = jest.fn();
        const res = { setHeader, status, json } as unknown as Response;
        const next = jest.fn();

        securityHeadersMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(405);
        expect(setHeader).toHaveBeenCalledWith(
          'Allow',
          'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
        );
      }
    });
  });
});
