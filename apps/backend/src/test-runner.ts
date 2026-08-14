import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './modules/auth/auth.service';
import { ProductsService } from './modules/products/products.service';
import { FavoritesService } from './modules/favorites/favorites.service';
import { ConversationsService } from './modules/conversations/conversations.service';
import { NotificationsService } from './modules/notifications/notifications.service';
import { ReportsService } from './modules/reports/reports.service';
import { AdminService } from './modules/admin/admin.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductStatus, UserRole, UserStatus, NotificationType } from '@safqa/types';
import { ConflictException, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

async function runAllTests() {
  console.log('🧪 Starting Backend Business Unit & Integration Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  async function assertThrows(fn: () => Promise<any>, errorType: any, testName: string) {
    try {
      await fn();
      console.error(` ❌ FAIL: ${testName} (Expected exception ${errorType.name} but none was thrown)`);
      failed++;
    } catch (err: any) {
      if (err instanceof errorType) {
        console.log(` ✅ PASS: ${testName} (Caught expected ${errorType.name})`);
        passed++;
      } else {
        console.error(` ❌ FAIL: ${testName} (Expected ${errorType.name} but got ${err.constructor.name}: ${err.message})`);
        failed++;
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST SUITE 1: AUTHENTICATION & IDENTITY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('--- Suite 1: Authentication & Identity ---');
  const prismaAuthMock: any = {
    user: {
      findFirst: jestFn(),
      findUnique: jestFn(),
      create: jestFn(),
    },
  };

  const authModule: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: PrismaService, useValue: prismaAuthMock },
      { provide: JwtService, useValue: { signAsync: async () => 'mock_access_token' } },
    ],
  }).compile();

  const authService = authModule.get<AuthService>(AuthService);

  // 1.1 Register duplicate check
  prismaAuthMock.user.findFirst.mockResolvedValue({ id: 'existing-id' });
  await assertThrows(
    () => authService.register({ full_name: 'A', email: 'exist@a.com', password: '123', phone_number: '010', gender: 'MALE' as any, birth_date: '1995-01-01' }),
    ConflictException,
    '1.1 Register blocks duplicate email/phone',
  );

  // 1.2 Invalid Login Credentials
  prismaAuthMock.user.findUnique.mockResolvedValue(null);
  await assertThrows(
    () => authService.login({ email: 'unknown@a.com', password: '123' }),
    UnauthorizedException,
    '1.2 Login throws UnauthorizedException for non-existent user',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST SUITE 2: PRODUCT MANAGEMENT & BUSINESS CONSTRAINTS
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Suite 2: Product Management & Business Constraints ---');
  const prismaProductMock: any = {
    category: { findUnique: jestFn() },
    product: {
      count: jestFn(),
      create: jestFn(),
      findUnique: jestFn(),
      update: jestFn(),
    },
  };

  const productModule: TestingModule = await Test.createTestingModule({
    providers: [
      ProductsService,
      { provide: PrismaService, useValue: prismaProductMock },
    ],
  }).compile();

  const productsService = productModule.get<ProductsService>(ProductsService);

  // 2.1 Daily Limit Rule (MAX 3 per day)
  prismaProductMock.category.findUnique.mockResolvedValue({ id: 'cat-1' });
  prismaProductMock.product.count.mockResolvedValue(3); // Already published 3 today
  await assertThrows(
    () => productsService.create('user-1', { title: 'Valid Title Here', description: 'Long enough product description', price: 500, condition: 'NEW' as any, category_id: 'cat-1', whatsapp_number: '01012345678' }),
    BadRequestException,
    '2.1 Daily posting limit blocks 4th product listing per day',
  );

  // 2.2 Ownership Authorization (User A cannot edit User B product)
  prismaProductMock.product.findUnique.mockResolvedValue({ id: 'prod-1', user_id: 'owner-user-id' });
  await assertThrows(
    () => productsService.update('prod-1', 'hacker-user-id', UserRole.USER, { title: 'Hacked Title' }),
    ForbiddenException,
    '2.2 User cannot modify another user product listing',
  );

  // 2.3 SUPER_ADMIN override (Admin can edit/archive any product)
  prismaProductMock.product.findUnique.mockResolvedValue({ id: 'prod-1', user_id: 'owner-user-id', status: ProductStatus.PUBLISHED });
  prismaProductMock.product.update.mockResolvedValue({ id: 'prod-1', status: ProductStatus.ARCHIVED });
  const adminArchiveRes = await productsService.archive('prod-1', 'admin-id', UserRole.SUPER_ADMIN);
  assert(adminArchiveRes.message.includes('archived'), '2.3 SUPER_ADMIN can archive any user listing');

  // ───────────────────────────────────────────────────────────────────────────
  // TEST SUITE 3: FAVORITES & NO SELF-FAVORITING RULE
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Suite 3: Favorites & Business Rules ---');
  const prismaFavMock: any = {
    product: { findUnique: jestFn() },
    favorite: { findUnique: jestFn(), create: jestFn(), delete: jestFn() },
  };

  const favModule: TestingModule = await Test.createTestingModule({
    providers: [
      FavoritesService,
      { provide: PrismaService, useValue: prismaFavMock },
    ],
  }).compile();

  const favoritesService = favModule.get<FavoritesService>(FavoritesService);

  // 3.1 No Self-Favoriting
  prismaFavMock.product.findUnique.mockResolvedValue({ id: 'prod-1', user_id: 'user-1', status: ProductStatus.PUBLISHED });
  await assertThrows(
    () => favoritesService.toggleFavorite('user-1', 'prod-1'),
    BadRequestException,
    '3.1 User cannot favorite their own product listing',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST SUITE 4: MESSAGING & NO SELF-MESSAGING RULE
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Suite 4: Messaging & Role Neutrality ---');
  const prismaConvMock: any = {
    product: { findUnique: jestFn() },
    conversation: { findFirst: jestFn(), create: jestFn() },
  };

  const convModule: TestingModule = await Test.createTestingModule({
    providers: [
      ConversationsService,
      { provide: PrismaService, useValue: prismaConvMock },
      { provide: NotificationsService, useValue: { createNotification: async () => {} } },
    ],
  }).compile();

  const conversationsService = convModule.get<ConversationsService>(ConversationsService);

  // 4.1 No Self-Messaging
  prismaConvMock.product.findUnique.mockResolvedValue({ id: 'prod-1', user_id: 'user-1', status: ProductStatus.PUBLISHED });
  await assertThrows(
    () => conversationsService.findOrCreateConversation('user-1', { product_id: 'prod-1' }),
    BadRequestException,
    '4.1 User cannot start a conversation with themselves',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST SUITE 5: ADMIN CASCADE SUSPENSION & REPORTS
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Suite 5: Admin Moderation & Cascade Suspension ---');
  const prismaAdminMock: any = {
    user: { findUnique: jestFn(), update: jestFn() },
    product: { updateMany: jestFn() },
  };

  const adminModule: TestingModule = await Test.createTestingModule({
    providers: [
      AdminService,
      { provide: PrismaService, useValue: prismaAdminMock },
      { provide: NotificationsService, useValue: { createNotification: async () => {} } },
    ],
  }).compile();

  const adminService = adminModule.get<AdminService>(AdminService);

  prismaAdminMock.user.findUnique.mockResolvedValue({ id: 'target-user', status: UserStatus.ACTIVE });
  prismaAdminMock.user.update.mockResolvedValue({ id: 'target-user', status: UserStatus.SUSPENDED });
  prismaAdminMock.product.updateMany.mockResolvedValue({ count: 5 });

  const suspendRes = await adminService.suspendUser('target-user', 'Abuse report');
  assert(suspendRes.user.status === UserStatus.SUSPENDED, '5.1 Admin can suspend user account');
  assert(prismaAdminMock.product.updateMany.mock.called, '5.2 Cascade Archival Rule: Automatically archives all published listings of suspended user');

  console.log(`\n==================================================`);
  console.log(`TEST SUMMARY: Passed: ${passed} | Failed: ${failed}`);
  console.log(`==================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Lightweight mock function builder
function jestFn() {
  let impl = async (...args: any[]) => undefined;
  const fn = async (...args: any[]) => {
    fn.called = true;
    fn.args = args;
    return impl(...args);
  };
  fn.called = false;
  fn.args = [] as any[];
  fn.mockResolvedValue = (val: any) => {
    impl = async () => val;
    return fn;
  };
  return fn;
}

runAllTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
