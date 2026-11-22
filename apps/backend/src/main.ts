import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import {
  buildCorsOptions,
  securityHeadersMiddleware,
} from './common/security/http-security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable X-Powered-By fingerprinting on Express adapter
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp && typeof expressApp.disable === 'function') {
    expressApp.disable('x-powered-by');
  }

  // Enforce OWASP HTTP security headers & block dangerous HTTP methods
  app.use(securityHeadersMiddleware);

  // Enforce strict CORS whitelist
  app.enableCors(buildCorsOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Safqa Backend Service running on http://localhost:${port}`);
}

bootstrap();
