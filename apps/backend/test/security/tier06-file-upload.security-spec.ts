import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MediaService } from '../../src/modules/media/media.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AttachMediaDto } from '../../src/modules/media/dto/attach-media.dto';
import { MediaEntityType } from '@safqa/types';
import { CONSTANTS } from '@safqa/utils';

describe('Tier 06 — File Upload, Media Processing & Path Traversal Defense (Security Suite)', () => {
  let mediaService: MediaService;
  let prismaMock: any;
  let writeFileSpy: jest.SpyInstance;
  let validationPipe: ValidationPipe;

  // Authentic magic-byte image headers
  const VALID_JPEG_BUFFER = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00,
  ]);
  const VALID_PNG_BUFFER = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48,
  ]);
  const VALID_WEBP_BUFFER = Buffer.concat([
    Buffer.from('RIFF', 'ascii'),
    Buffer.from([0x24, 0x00, 0x00, 0x00]),
    Buffer.from('WEBP', 'ascii'),
    Buffer.from('VP8 ', 'ascii'),
  ]);

  beforeEach(async () => {
    prismaMock = {
      product: { findUnique: jest.fn() },
      user: { findUnique: jest.fn() },
      media: {
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    mediaService = module.get<MediaService>(MediaService);
    writeFileSpy = jest
      .spyOn(fs.promises, 'writeFile')
      .mockResolvedValue(undefined);

    validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ─── Scenario 6.1: Executable & Script Upload Blocking ─────────────────────
  describe('Scenario 6.1: Executable, Script & Spoofed MIME Upload Blocking', () => {
    it('should block dangerous executable and script MIME types (.php, .exe, .sh, .js, .svg, .html)', async () => {
      const dangerousFiles = [
        { originalname: 'shell.php', mimetype: 'application/x-httpd-php', buffer: Buffer.from('<?php system($_GET["c"]); ?>') },
        { originalname: 'malware.exe', mimetype: 'application/x-msdownload', buffer: Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00') },
        { originalname: 'pwn.sh', mimetype: 'application/x-sh', buffer: Buffer.from('#!/bin/bash\nrm -rf /') },
        { originalname: 'payload.js', mimetype: 'application/javascript', buffer: Buffer.from('alert(document.cookie);') },
        { originalname: 'xss.svg', mimetype: 'image/svg+xml', buffer: Buffer.from('<svg onload="alert(1)"></svg>') },
        { originalname: 'phish.html', mimetype: 'text/html', buffer: Buffer.from('<html><script>alert(1)</script></html>') },
      ];

      for (const file of dangerousFiles) {
        await expect(
          mediaService.uploadFile({ ...file, size: file.buffer.length }),
        ).rejects.toThrow(BadRequestException);
      }

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should block disguised dangerous extensions even when MIME type is spoofed as image/jpeg', async () => {
      const disguisedFiles = ['shell.php', 'xss.svg', 'index.html', 'exploit.js', 'dropper.exe'];

      for (const originalname of disguisedFiles) {
        await expect(
          mediaService.uploadFile({
            originalname,
            mimetype: 'image/jpeg',
            size: VALID_JPEG_BUFFER.length,
            buffer: VALID_JPEG_BUFFER,
          }),
        ).rejects.toThrow(BadRequestException);
      }

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should block spoofed .jpg file containing script content via magic bytes inspection', async () => {
      const fakeImageBuffer = Buffer.from('<?php echo shell_exec("id"); ?>');

      await expect(
        mediaService.uploadFile({
          originalname: 'totally-legit-photo.jpg',
          mimetype: 'image/jpeg',
          size: fakeImageBuffer.length,
          buffer: fakeImageBuffer,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should block mismatched magic bytes (e.g. PNG binary uploaded with image/jpeg MIME)', async () => {
      await expect(
        mediaService.uploadFile({
          originalname: 'mismatch.jpg',
          mimetype: 'image/jpeg',
          size: VALID_PNG_BUFFER.length,
          buffer: VALID_PNG_BUFFER,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should accept authentic JPEG, PNG, and WEBP images', async () => {
      const validFiles = [
        { originalname: 'photo.jpg', mimetype: 'image/jpeg', buffer: VALID_JPEG_BUFFER, expectedExt: '.jpg' },
        { originalname: 'avatar.png', mimetype: 'image/png', buffer: VALID_PNG_BUFFER, expectedExt: '.png' },
        { originalname: 'banner.webp', mimetype: 'image/webp', buffer: VALID_WEBP_BUFFER, expectedExt: '.webp' },
      ];

      for (const f of validFiles) {
        const res = await mediaService.uploadFile({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.buffer.length,
          buffer: f.buffer,
        });
        expect(res.url).toMatch(new RegExp(`^/uploads/[0-9a-f-]{36}\\${f.expectedExt}$`));
        expect(res.mimetype).toBe(f.mimetype);
      }

      expect(writeFileSpy).toHaveBeenCalledTimes(3);
    });
  });

  // ─── Scenario 6.2: File Size Enforcement (Max 5MB) ─────────────────────────
  describe('Scenario 6.2: File Size Enforcement (Max 5MB)', () => {
    it('should reject a 6MB file upload with 400 Bad Request', async () => {
      const sixMb = 6 * 1024 * 1024;
      const oversizedBuffer = Buffer.concat([
        VALID_JPEG_BUFFER,
        Buffer.alloc(sixMb - VALID_JPEG_BUFFER.length),
      ]);

      await expect(
        mediaService.uploadFile({
          originalname: 'huge.jpg',
          mimetype: 'image/jpeg',
          size: sixMb,
          buffer: oversizedBuffer,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should reject file with spoofed small size metadata when actual buffer exceeds 5MB', async () => {
      const oversizedBuffer = Buffer.concat([
        VALID_JPEG_BUFFER,
        Buffer.alloc(CONSTANTS.MAX_FILE_SIZE_BYTES + 1024),
      ]);

      await expect(
        mediaService.uploadFile({
          originalname: 'spoofed-size.jpg',
          mimetype: 'image/jpeg',
          size: 100, // Spoofed small size
          buffer: oversizedBuffer,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it('should reject empty or missing upload payload', async () => {
      await expect(mediaService.uploadFile(null)).rejects.toThrow(BadRequestException);
      await expect(
        mediaService.uploadFile({
          originalname: 'empty.jpg',
          mimetype: 'image/jpeg',
          size: 0,
          buffer: Buffer.alloc(0),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Scenario 6.3: Directory Traversal via Filename Manipulation ───────────
  describe('Scenario 6.3: Directory Traversal Prevention', () => {
    it('should completely discard traversal filenames (../../../../etc/passwd.jpg, ..\\..\\main.jpg) and assign safe UUID inside uploads/', async () => {
      const traversalNames = [
        '../../../../etc/passwd.jpg',
        '..\\..\\..\\src\\main.jpg',
        '/etc/shadow.png',
      ];

      for (const maliciousName of traversalNames) {
        const isPng = maliciousName.endsWith('.png');
        const buf = isPng ? VALID_PNG_BUFFER : VALID_JPEG_BUFFER;
        const mime = isPng ? 'image/png' : 'image/jpeg';

        const result = await mediaService.uploadFile({
          originalname: maliciousName,
          mimetype: mime,
          size: buf.length,
          buffer: buf,
        });

        expect(result.filename).not.toContain('..');
        expect(result.filename).not.toContain('/');
        expect(result.filename).not.toContain('\\');
        expect(result.filename).toMatch(/^[0-9a-f-]{36}\.(jpg|png|webp)$/);

        const writtenPath: string = writeFileSpy.mock.calls[writeFileSpy.mock.calls.length - 1][0];
        const expectedDir = path.resolve(process.cwd(), 'uploads');
        expect(path.resolve(writtenPath).startsWith(expectedDir + path.sep)).toBe(true);
      }
    });

    it('should reject path traversal sequences in AttachMediaDto url', async () => {
      const traversalUrls = [
        '/uploads/../../etc/passwd',
        '/uploads/..\\..\\main.js',
        '/uploads/..',
      ];

      for (const badUrl of traversalUrls) {
        await expect(
          validationPipe.transform(
            {
              entity_type: MediaEntityType.PRODUCT,
              entity_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
              url: badUrl,
            },
            { type: 'body', metatype: AttachMediaDto },
          ),
        ).rejects.toThrow(BadRequestException);
      }
    });
  });

  // ─── Scenario 6.4: Maximum Media Limits per Entity ─────────────────────────
  describe('Scenario 6.4: Maximum Media Limits per Entity (Max 5 per Product)', () => {
    it('should reject attaching a 6th image to a product that already has 5 images', async () => {
      const productId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      prismaMock.product.findUnique.mockResolvedValue({
        id: productId,
        user_id: 'owner-1',
      });
      prismaMock.media.count.mockResolvedValue(5);

      await expect(
        mediaService.attachMedia(
          {
            entity_type: MediaEntityType.PRODUCT,
            entity_id: productId,
            url: '/uploads/550e8400-e29b-41d4-a716-446655440000.jpg',
          },
          'owner-1',
          false,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.media.create).not.toHaveBeenCalled();
    });
  });
});
