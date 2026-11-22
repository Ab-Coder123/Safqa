import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from '../../src/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '../../src/modules/products/dto/update-product.dto';
import { SearchProductsDto } from '../../src/modules/products/dto/search-products.dto';
import { RegisterDto } from '../../src/modules/auth/dto/register.dto';
import { UpdateProfileDto } from '../../src/modules/users/dto/update-profile.dto';
import { SendMessageDto } from '../../src/modules/conversations/dto/send-message.dto';
import { AttachMediaDto } from '../../src/modules/media/dto/attach-media.dto';
import { CreateCategoryDto } from '../../src/modules/categories/dto/create-category.dto';
import { ProductsService } from '../../src/modules/products/products.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ProductCondition, UserGender, MediaEntityType } from '@safqa/types';

describe('Tier 03 — Input Validation, Sanitization & Injection Defense (Security Suite)', () => {
  let validationPipe: ValidationPipe;
  let productsService: ProductsService;
  let prismaMock: any;

  beforeEach(() => {
    // Replicate global ValidationPipe configured in apps/backend/src/main.ts
    validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    });

    prismaMock = {
      product: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
      },
      media: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    productsService = new ProductsService(prismaMock as unknown as PrismaService);
  });

  // ─── Scenario 3.1: Strict Whitelist & Malicious Field Stripping ──────────────
  describe('Scenario 3.1: Strict Whitelist & Malicious Field Injection Defense', () => {
    it('should reject CreateProductDto when an injected malicious field (e.g. role, is_admin) is sent', async () => {
      const maliciousPayload = {
        title: 'Toyota Corolla 2022 Mint Condition',
        description: 'Toyota Corolla 2022 in excellent condition, all maintenance done.',
        price: 750000,
        condition: ProductCondition.USED,
        category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        whatsapp_number: '01012345678',
        media_urls: ['/uploads/car.webp'],
        role: 'SUPER_ADMIN', // INJECTED FIELD
        is_verified: true,   // INJECTED FIELD
      };

      await expect(
        validationPipe.transform(maliciousPayload, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject UpdateProfileDto when attempting privilege escalation fields', async () => {
      const maliciousPayload = {
        full_name: 'Regular User',
        role: 'SUPER_ADMIN', // Mass assignment attempt
        status: 'ACTIVE',
      };

      await expect(
        validationPipe.transform(maliciousPayload, {
          type: 'body',
          metatype: UpdateProfileDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject RegisterDto when injecting unauthorized properties', async () => {
      const maliciousPayload = {
        full_name: 'Attacker User',
        email: 'attacker@safqa.com',
        password: 'password123',
        phone_number: '01012345678',
        gender: UserGender.MALE,
        birth_date: '1995-05-15',
        role: 'SUPER_ADMIN',
        account_balance: 999999,
      };

      await expect(
        validationPipe.transform(maliciousPayload, {
          type: 'body',
          metatype: RegisterDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Scenario 3.2: SQL / Query Injection in Search & Filter Parameters ───────
  describe('Scenario 3.2: SQL / Query Injection Defense in Search & Filter Parameters', () => {
    it('should safely parameterize SQL injection strings in fulltext search query without error', async () => {
      const sqlInjectionQueries = [
        "' OR 1=1 --",
        "'; DROP TABLE products; --",
        "' UNION SELECT id, password_hash FROM users --",
        "' OR 'x'='x",
      ];

      for (const query of sqlInjectionQueries) {
        await productsService.findAll({ q: query, page: 1, limit: 10 });

        // Verify Prisma received the search text literally inside parameterized query structure
        expect(prismaMock.product.count).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: expect.arrayContaining([
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ]),
            }),
          }),
        );
      }
    });

    it('should reject SQL injection payload in category_id parameter via UUID validator', async () => {
      const maliciousCategoryPayload = {
        category_id: "'; DROP TABLE categories; --",
      };

      await expect(
        validationPipe.transform(maliciousCategoryPayload, {
          type: 'query',
          metatype: SearchProductsDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Scenario 3.3: Stored XSS & Script URL Scheme Injection ──────────────────
  describe('Scenario 3.3: Stored XSS & Dangerous Protocol URL Injection', () => {
    it('should reject javascript: protocol URI in CreateProductDto media_urls', async () => {
      const xssPayload = {
        title: 'MacBook Pro 16 inch Apple Silicon',
        description: 'MacBook Pro in perfect condition with original charger and box.',
        price: 85000,
        condition: ProductCondition.USED,
        category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        whatsapp_number: '01012345678',
        media_urls: ['javascript:alert(document.cookie)'],
      };

      await expect(
        validationPipe.transform(xssPayload, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject data:text/html protocol in AttachMediaDto url', async () => {
      const dangerousPayload = {
        entity_type: MediaEntityType.PRODUCT,
        entity_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        url: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      };

      await expect(
        validationPipe.transform(dangerousPayload, {
          type: 'body',
          metatype: AttachMediaDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject dangerous script URLs in RegisterDto and UpdateProfileDto avatar_url', async () => {
      const maliciousRegister = {
        full_name: 'Test XSS',
        email: 'xss@safqa.com',
        password: 'password123',
        phone_number: '01012345678',
        gender: UserGender.FEMALE,
        birth_date: '2000-01-01',
        avatar_url: 'javascript:alert("XSS")',
      };

      await expect(
        validationPipe.transform(maliciousRegister, {
          type: 'body',
          metatype: RegisterDto,
        }),
      ).rejects.toThrow(BadRequestException);

      const maliciousUpdate = {
        avatar_url: 'vbscript:msgbox("XSS")',
      };

      await expect(
        validationPipe.transform(maliciousUpdate, {
          type: 'body',
          metatype: UpdateProfileDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow valid HTTPS and /uploads/ image paths in media and avatar fields', async () => {
      const validRegister = {
        full_name: 'Valid User',
        email: 'valid@safqa.com',
        password: 'password123',
        phone_number: '01012345678',
        gender: UserGender.MALE,
        birth_date: '1998-04-12',
        avatar_url: '/uploads/e2df8c9a-12cb-4882-9ef0-6625886cd6f9.jpg',
      };

      const transformed = await validationPipe.transform(validRegister, {
        type: 'body',
        metatype: RegisterDto,
      });

      expect(transformed.avatar_url).toBe('/uploads/e2df8c9a-12cb-4882-9ef0-6625886cd6f9.jpg');
    });
  });

  // ─── Scenario 3.4: Extreme Payload & Boundary Values ─────────────────────────
  describe('Scenario 3.4: Extreme Payload & Boundary Values Verification', () => {
    it('should reject negative, zero, and out-of-range decimal price in CreateProductDto', async () => {
      const basePayload = {
        title: 'PlayStation 5 Console Digital Edition',
        description: 'Brand new PlayStation 5 digital edition with one controller.',
        condition: ProductCondition.NEW,
        category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        whatsapp_number: '01012345678',
        media_urls: ['https://images.unsplash.com/photo-1.jpg'],
      };

      // Negative price
      await expect(
        validationPipe.transform({ ...basePayload, price: -500 }, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow(BadRequestException);

      // Zero price
      await expect(
        validationPipe.transform({ ...basePayload, price: 0 }, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow(BadRequestException);

      // Excessive decimal overflow (exceeds max 999,999,999.99)
      await expect(
        validationPipe.transform({ ...basePayload, price: 1000000000000 }, {
          type: 'body',
          metatype: CreateProductDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid mobile phone number formats', async () => {
      const invalidPhones = ['01312345678', '1234567890', '+18005550199', '0101234567']; // Not 11 digits / invalid prefix

      for (const phone of invalidPhones) {
        await expect(
          validationPipe.transform(
            {
              full_name: 'Test Phone',
              email: 'phone@safqa.com',
              password: 'password123',
              phone_number: phone,
              gender: UserGender.MALE,
              birth_date: '1995-01-01',
            },
            { type: 'body', metatype: RegisterDto },
          ),
        ).rejects.toThrow(BadRequestException);
      }
    });

    it('should reject empty or overly long message contents in SendMessageDto', async () => {
      // Empty content
      await expect(
        validationPipe.transform({ content: '' }, {
          type: 'body',
          metatype: SendMessageDto,
        }),
      ).rejects.toThrow(BadRequestException);

      // Content exceeding 2000 characters
      const oversizedContent = 'A'.repeat(2001);
      await expect(
        validationPipe.transform({ content: oversizedContent }, {
          type: 'body',
          metatype: SendMessageDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject search queries exceeding 100 characters in SearchProductsDto', async () => {
      const oversizedQuery = 'A'.repeat(101);
      await expect(
        validationPipe.transform({ q: oversizedQuery }, {
          type: 'query',
          metatype: SearchProductsDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid category slug with uppercase or special characters in CreateCategoryDto', async () => {
      const invalidSlugPayload = {
        name: 'Electronics',
        slug: 'Electronics & Gadgets!', // Invalid slug format
      };

      await expect(
        validationPipe.transform(invalidSlugPayload, {
          type: 'body',
          metatype: CreateCategoryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
