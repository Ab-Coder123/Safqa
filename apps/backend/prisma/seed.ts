import { PrismaClient, UserRole, UserGender, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Categories
  const categories = [
    { name: 'سيارات ومركبات', slug: 'vehicles', icon_url: 'car' },
    { name: 'عقارات', slug: 'real-estate', icon_url: 'home' },
    { name: 'إلكترونيات وأجهزة منزلية', slug: 'electronics', icon_url: 'tv' },
    { name: 'موبايلات وأكسسواراتها', slug: 'mobile-phones', icon_url: 'smartphone' },
    { name: 'أثاث وديكور', slug: 'furniture', icon_url: 'sofa' },
    { name: 'موضة وأزياء', slug: 'fashion', icon_url: 'shirt' },
    { name: 'مستلزمات أطفال', slug: 'baby-items', icon_url: 'baby' },
    { name: 'رياضة وهوايات', slug: 'sports', icon_url: 'dumbbell' },
    { name: 'خدمات وظائف', slug: 'services-jobs', icon_url: 'briefcase' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon_url: cat.icon_url,
      },
    });
  }
  console.log('✅ Categories seeded successfully.');

  // 2. Seed Default Super Admin Account
  const adminEmail = 'admin@safqa.com';
  const hashedPassword = await bcrypt.hash('AdminSafqaPass123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      full_name: 'مدير منصة صفقة',
      email: adminEmail,
      password_hash: hashedPassword,
      phone_number: '01000000000',
      gender: UserGender.MALE,
      birth_date: new Date('1990-01-01'),
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ Default Super Admin account seeded successfully.');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
