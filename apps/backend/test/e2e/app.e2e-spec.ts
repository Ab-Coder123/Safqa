import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { randomUUID } from 'crypto';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ThrottlerGuard } from '../../src/common/guards/throttler.guard';
import {
  buildCorsOptions,
  securityHeadersMiddleware,
} from '../../src/common/security/http-security.config';
import {
  ProductCondition,
  ProductStatus,
  ReportStatus,
  ReportTargetType,
  UserGender,
  UserRole,
  UserStatus,
} from '@safqa/types';

/**
 * Stateful in-memory Prisma double for full HTTP End-to-End testing
 * without mutating production or external databases.
 */
function createInMemoryPrismaMock() {
  const categoryId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const users = new Map<string, any>();
  const categories = new Map<string, any>([
    [categoryId, { id: categoryId, name: 'Electronics', slug: 'electronics', icon_url: null, parent_id: null, created_at: new Date() }],
  ]);
  const products = new Map<string, any>();
  const mediaRecords: any[] = [];
  const favorites = new Map<string, any>();
  const conversations = new Map<string, any>();
  const messages: any[] = [];
  const notifications: any[] = [];
  const reports = new Map<string, any>();

  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(async (ops: Promise<any>[]) => Promise.all(ops)),
    user: {
      findUnique: jest.fn(async ({ where, select }: any) => {
        let found: any = null;
        if (where.id) found = users.get(where.id) || null;
        else if (where.email) {
          found = [...users.values()].find((u) => u.email === where.email) || null;
        } else if (where.phone_number) {
          found = [...users.values()].find((u) => u.phone_number === where.phone_number) || null;
        }
        if (!found) return null;
        if (!select) return { ...found };
        const projected: any = {};
        for (const k of Object.keys(select)) {
          if (select[k] && k !== '_count') projected[k] = found[k];
        }
        return projected;
      }),
      create: jest.fn(async ({ data }: any) => {
        const record = {
          id: randomUUID(),
          created_at: new Date(),
          updated_at: new Date(),
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          ...data,
        };
        users.set(record.id, record);
        return { ...record };
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const existing = users.get(where.id);
        if (!existing) return null;
        const updated = { ...existing, ...data, updated_at: new Date() };
        users.set(where.id, updated);
        return { ...updated };
      }),
    },
    category: {
      findUnique: jest.fn(async ({ where }: any) => categories.get(where.id) || null),
      findMany: jest.fn(async () => [...categories.values()]),
    },
    product: {
      count: jest.fn(async ({ where }: any) => {
        return [...products.values()].filter((p) => {
          if (where?.user_id && p.user_id !== where.user_id) return false;
          if (where?.status && typeof where.status === 'string' && p.status !== where.status) return false;
          return true;
        }).length;
      }),
      create: jest.fn(async ({ data }: any) => {
        const record = {
          id: randomUUID(),
          currency: 'EGP',
          status: ProductStatus.PUBLISHED,
          created_at: new Date(),
          updated_at: new Date(),
          ...data,
        };
        products.set(record.id, record);
        return {
          ...record,
          category: categories.get(record.category_id),
          user: {
            id: record.user_id,
            full_name: users.get(record.user_id)?.full_name || 'User',
            avatar_url: null,
          },
        };
      }),
      findMany: jest.fn(async ({ where }: any) => {
        return [...products.values()]
          .filter((p) => {
            if (where?.status && p.status !== where.status) return false;
            if (where?.OR) {
              const q = where.OR[0]?.title?.contains?.toLowerCase() || '';
              return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
            }
            return true;
          })
          .map((p) => ({
            ...p,
            category: categories.get(p.category_id),
            user: {
              id: p.user_id,
              full_name: users.get(p.user_id)?.full_name || 'User',
              avatar_url: null,
            },
          }));
      }),
      findUnique: jest.fn(async ({ where }: any) => {
        const p = products.get(where.id);
        if (!p) return null;
        return {
          ...p,
          category: categories.get(p.category_id),
          user: {
            id: p.user_id,
            full_name: users.get(p.user_id)?.full_name || 'User',
            avatar_url: null,
            created_at: new Date(),
            _count: { products: 1 },
          },
        };
      }),
      updateMany: jest.fn(async ({ where, data }: any) => {
        let count = 0;
        for (const [id, p] of products.entries()) {
          if (where.id && p.id !== where.id) continue;
          if (where.status && p.status !== where.status) continue;
          products.set(id, { ...p, ...data, updated_at: new Date() });
          count += 1;
        }
        return { count };
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const existing = products.get(where.id);
        const updated = { ...existing, ...data, updated_at: new Date() };
        products.set(where.id, updated);
        return updated;
      }),
    },
    media: {
      createMany: jest.fn(async ({ data }: any) => {
        for (const item of data) {
          mediaRecords.push({ id: randomUUID(), created_at: new Date(), ...item });
        }
        return { count: data.length };
      }),
      findMany: jest.fn(async ({ where }: any) => {
        return mediaRecords.filter((m) => {
          if (where?.entity_id && typeof where.entity_id === 'string') {
            return m.entity_id === where.entity_id;
          }
          if (where?.entity_id?.in) {
            return where.entity_id.in.includes(m.entity_id);
          }
          return true;
        });
      }),
    },
    favorite: {
      findUnique: jest.fn(async ({ where }: any) => {
        const k = `${where.user_id_product_id.user_id}:${where.user_id_product_id.product_id}`;
        return favorites.get(k) || null;
      }),
      create: jest.fn(async ({ data }: any) => {
        const k = `${data.user_id}:${data.product_id}`;
        const rec = { ...data, created_at: new Date() };
        favorites.set(k, rec);
        return rec;
      }),
      delete: jest.fn(async ({ where }: any) => {
        const k = `${where.user_id_product_id.user_id}:${where.user_id_product_id.product_id}`;
        favorites.delete(k);
        return {};
      }),
      findMany: jest.fn(async ({ where }: any) => {
        return [...favorites.values()]
          .filter((f) => f.user_id === where.user_id)
          .map((f) => ({
            ...f,
            product: {
              ...products.get(f.product_id),
              category: categories.get(categoryId),
              user: { id: 'seller', full_name: 'Seller', avatar_url: null },
            },
          }));
      }),
    },
    conversation: {
      findFirst: jest.fn(async () => null),
      create: jest.fn(async ({ data }: any) => {
        const conv = {
          id: randomUUID(),
          created_at: new Date(),
          last_message_at: null,
          ...data,
          user_one: { id: data.user_one_id, full_name: 'Buyer', avatar_url: null },
          user_two: { id: data.user_two_id, full_name: 'Seller', avatar_url: null },
        };
        conversations.set(conv.id, conv);
        return conv;
      }),
      findUnique: jest.fn(async ({ where }: any) => {
        const c = conversations.get(where.id);
        if (!c) return null;
        return {
          ...c,
          user_one: users.get(c.user_one_id) || { id: c.user_one_id, status: UserStatus.ACTIVE, full_name: 'Buyer' },
          user_two: users.get(c.user_two_id) || { id: c.user_two_id, status: UserStatus.ACTIVE, full_name: 'Seller' },
        };
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const c = conversations.get(where.id);
        if (!c) return null;
        const updated = { ...c, ...data };
        conversations.set(where.id, updated);
        return updated;
      }),
    },
    message: {
      create: jest.fn(async ({ data }: any) => {
        const msg = {
          id: randomUUID(),
          created_at: new Date(),
          is_read: false,
          ...data,
          sender: { id: data.sender_id, full_name: 'Buyer', avatar_url: null },
        };
        messages.push(msg);
        return msg;
      }),
    },
    notification: {
      create: jest.fn(async ({ data }: any) => {
        const n = { id: randomUUID(), is_read: false, created_at: new Date(), ...data };
        notifications.push(n);
        return n;
      }),
    },
    report: {
      findFirst: jest.fn(async () => null),
      create: jest.fn(async ({ data }: any) => {
        const r = {
          id: randomUUID(),
          status: ReportStatus.PENDING,
          created_at: new Date(),
          ...data,
          reporter: { id: data.reporter_id, full_name: 'Buyer', email: 'buyer@safqa.com' },
        };
        reports.set(r.id, r);
        return r;
      }),
    },
  };
}

describe('Phase 11 — Full Backend HTTP E2E Suite', () => {
  let app: INestApplication;
  const prismaMock = createInMemoryPrismaMock();

  beforeAll(async () => {
    ThrottlerGuard.resetStorage();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    const expressApp = app.getHttpAdapter().getInstance();
    if (expressApp && typeof expressApp.disable === 'function') {
      expressApp.disable('x-powered-by');
    }
    app.use(securityHeadersMiddleware);
    app.enableCors(buildCorsOptions({ CORS_ORIGINS: 'https://safqa.vercel.app' } as any));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    ThrottlerGuard.resetStorage();
  });

  it('GET /health should return 200 OK with OWASP security headers and no X-Powered-By', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('safqa-backend');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['strict-transport-security']).toContain('max-age=31536000');
  });

  it('TRACE /health should be rejected with 405 Method Not Allowed', async () => {
    await request(app.getHttpServer()).trace('/health').expect(405);
  });

  it('CORS should allow https://safqa.vercel.app and exclude evil origins', async () => {
    const allowed = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'https://safqa.vercel.app')
      .expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('https://safqa.vercel.app');

    const blocked = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'https://evil-attacker.com')
      .expect(500); // CORS callback error caught cleanly
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('GET /uploads/missing-file.jpg should return 404 (not 500)', async () => {
    const res = await request(app.getHttpServer()).get('/uploads/missing-file-e2e.jpg');
    expect(res.status).toBe(404);
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
  });

  it('End-to-End Marketplace Journey: Register Seller & Buyer -> Publish -> Search -> Favorite -> Chat -> Mark Sold -> Report', async () => {
    const server = app.getHttpServer();

    // 1. Register Seller
    const sellerReg = await request(server)
      .post('/auth/register')
      .send({
        full_name: 'Seller E2E',
        email: 'seller.e2e@safqa.com',
        password: 'StrongPassword123',
        phone_number: '01011112222',
        gender: UserGender.MALE,
        birth_date: '1995-01-01',
      })
      .expect(201);

    expect(sellerReg.body.user.password_hash).toBeUndefined();
    const sellerToken = sellerReg.body.tokens.accessToken;

    // 2. Reject mass assignment when creating product
    await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'MacBook Pro M3 E2E Test',
        description: 'Clean laptop tested via end-to-end HTTP suite with box and charger.',
        price: 55000,
        condition: ProductCondition.USED,
        category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        whatsapp_number: '01011112222',
        media_urls: ['https://example.com/macbook.jpg'],
        role: UserRole.SUPER_ADMIN, // illegal extra field
      })
      .expect(400);

    // 3. Create Product
    const createdProduct = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'MacBook Pro M3 E2E Test',
        description: 'Clean laptop tested via end-to-end HTTP suite with box and charger.',
        price: 55000,
        condition: ProductCondition.USED,
        category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        whatsapp_number: '01011112222',
        media_urls: ['https://example.com/macbook.jpg'],
      })
      .expect(201);

    const productId = createdProduct.body.product.id;
    expect(productId).toBeDefined();

    // 4. Register Buyer
    const buyerReg = await request(server)
      .post('/auth/register')
      .send({
        full_name: 'Buyer E2E',
        email: 'buyer.e2e@safqa.com',
        password: 'BuyerPassword123',
        phone_number: '01033334444',
        gender: UserGender.FEMALE,
        birth_date: '1998-06-15',
      })
      .expect(201);

    const buyerToken = buyerReg.body.tokens.accessToken;

    // 5. Browse & Search Products
    const searchRes = await request(server).get('/products?q=MacBook').expect(200);
    expect(searchRes.body.data.length).toBeGreaterThanOrEqual(1);

    // 6. Buyer Favorites Product
    const favRes = await request(server)
      .post(`/favorites/toggle/${productId}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200);
    expect(favRes.body.is_favorited).toBe(true);

    // 7. Buyer Starts Conversation & Sends Message
    const convRes = await request(server)
      .post('/conversations')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ product_id: productId })
      .expect(200);

    const convId = convRes.body.id;
    const msgRes = await request(server)
      .post(`/conversations/${convId}/messages`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ content: 'Is the MacBook still available?' })
      .expect(201);
    expect(msgRes.body.content).toBe('Is the MacBook still available?');

    // 8. Unauthorized Buyer Cannot Mark Seller's Product Sold
    await request(server)
      .patch(`/products/${productId}/sold`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(403);

    // 9. Seller Marks Product Sold (and double mark fails)
    await request(server)
      .patch(`/products/${productId}/sold`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);

    await request(server)
      .patch(`/products/${productId}/sold`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(400);

    // 10. Buyer Submits Report
    await request(server)
      .post('/reports')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        target_type: ReportTargetType.PRODUCT,
        target_id: productId,
        reason: 'Testing moderation workflow E2E',
      })
      .expect(201);
  });
});
