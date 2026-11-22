import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { ThrottlerGuard } from './common/guards/throttler.guard';
import { getUploadsDir } from './common/utils/upload-path.util';
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
      rootPath: getUploadsDir(),
      serveRoot: '/uploads',
      exclude: ['/uploads/(.*)'],
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
        maxAge: '7d',
      },
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
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
