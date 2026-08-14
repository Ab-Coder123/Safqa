import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    MediaModule,
    CategoriesModule,
    UsersModule,
    ProductsModule,
    FavoritesModule,
    NotificationsModule,
    ConversationsModule,
    ReportsModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
